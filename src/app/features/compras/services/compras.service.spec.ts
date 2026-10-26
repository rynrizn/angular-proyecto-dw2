import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../../core/services/auth-service';
import { ComprasService } from './compras.service';

const API = 'http://localhost:5175/api';

const INSUMOS = [
  { id: 1, nombre: 'Madera de Pino', unidadMedida: 'm³', stockActual: 25, stockMinimo: 10, costoPromedio: 45.5 },
  { id: 2, nombre: 'Tornillos para Madera 3"', unidadMedida: 'caja', stockActual: 50, stockMinimo: 20, costoPromedio: 8.9 }
];

const COMPRA = { id: 7, usuarioId: 1, insumoId: 2, proveedorId: 2, fecha: '2026-10-20T10:30:00', precioUnitario: 8.9, cantidad: 30 };

describe('ComprasService', () => {
  let service: ComprasService;
  let http: HttpTestingController;
  const usuarioActual = signal<{ id: number } | null>({ id: 7 });

  // Responde las dos peticiones que hace cargarDatos()
  function responderCarga(compras: unknown[] = [COMPRA]) {
    http.expectOne(r => r.method === 'GET' && r.url.startsWith(`${API}/compras`)).flush(compras);
    http.expectOne(`${API}/insumos`).flush(INSUMOS);
  }

  beforeEach(() => {
    usuarioActual.set({ id: 7 });
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { usuarioActual } }
      ]
    });
    service = TestBed.inject(ComprasService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('empieza con 4 proveedores locales y sin compras', () => {
    expect(service.proveedores().length).toBe(4);
    expect(service.compras().length).toBe(0);
  });

  it('crea un proveedor con el siguiente id', () => {
    const nuevo = service.crearProveedor({ nombreEmpresa: 'Prueba S.A.', contacto: 'Ana', telefono: '7000000' });
    expect(nuevo.id).toBe(5);
    expect(service.proveedores().length).toBe(5);
  });

  it('actualiza solo los campos enviados', () => {
    service.actualizarProveedor(1, { telefono: '99999999' });
    expect(service.obtenerProveedor(1)?.telefono).toBe('99999999');
    expect(service.obtenerProveedor(1)?.contacto).toBe('Carlos Mamani');
  });

  it('rechaza un proveedor con nombre repetido, sin importar mayúsculas', () => {
    expect(() =>
      service.crearProveedor({ nombreEmpresa: ' ferretería el tornillo ', contacto: 'Ana', telefono: '7000000' })
    ).toThrowError('Ya existe un proveedor con ese nombre.');
    expect(service.proveedores().length).toBe(4);
  });

  it('permite editar un proveedor conservando su propio nombre', () => {
    service.actualizarProveedor(2, { nombreEmpresa: 'Ferretería El Tornillo', contacto: 'Nuevo' });
    expect(service.obtenerProveedor(2)?.contacto).toBe('Nuevo');
  });

  it('muestra "Sin proveedor" cuando el backend devuelve 0', () => {
    expect(service.nombreProveedor(0)).toBe('Sin proveedor');
    expect(service.nombreProveedor(99)).toBe('Proveedor desconocido');
  });

  it('carga compras e insumos desde la API', async () => {
    const promesa = service.cargarDatos();
    responderCarga();
    await promesa;

    expect(service.compras()).toEqual([COMPRA]);
    expect(service.insumos().length).toBe(2);
    expect(service.nombreInsumo(2)).toBe('Tornillos para Madera 3"');
    expect(service.errorCarga()).toBe('');
    expect(service.cargando()).toBe(false);
  });

  it('usa /compras/por-insumo cuando se filtra por un insumo', async () => {
    const promesa = service.cargarDatos(2);

    const peticion = http.expectOne(r => r.url === `${API}/compras/por-insumo`);
    expect(peticion.request.params.get('insumoId')).toBe('2');
    peticion.flush([COMPRA]);
    http.expectOne(`${API}/insumos`).flush(INSUMOS);
    await promesa;

    expect(service.compras().length).toBe(1);
  });

  it('muestra un mensaje claro si no hay conexión con el servidor', async () => {
    const promesa = service.cargarDatos();

    http.expectOne(`${API}/compras`).error(new ProgressEvent('error'));
    http.expectOne(`${API}/insumos`).flush([]);
    await promesa;

    expect(service.errorCarga()).toContain('No se pudo conectar con el servidor');
  });

  it('registra una compra con un POST y vuelve a cargar los datos', async () => {
    const carga = service.cargarDatos();
    responderCarga();
    await carga;

    const promesa = service.registrarCompra({ proveedorId: 2, insumoId: 2, cantidad: 10, precioUnitario: 8.9 });

    const peticion = http.expectOne(r => r.method === 'POST' && r.url === `${API}/compras`);
    expect(peticion.request.body).toEqual({
      usuarioId: 7,
      insumoId: 2,
      proveedorId: 2,
      precioUnitario: 8.9,
      cantidad: 10
    });
    peticion.flush({ mensaje: 'Compra registrada correctamente' });
    await new Promise(resolve => setTimeout(resolve));

    responderCarga();
    await promesa;
  });

  it('traduce el error del servidor a un mensaje', async () => {
    const carga = service.cargarDatos();
    responderCarga();
    await carga;

    const resultado = service
      .registrarCompra({ proveedorId: 2, insumoId: 2, cantidad: 10, precioUnitario: 8.9 })
      .then(() => 'sin error', (error: Error) => error.message);

    http.expectOne(r => r.method === 'POST').flush('Insumo no encontrado', { status: 400, statusText: 'Bad Request' });

    expect(await resultado).toBe('Insumo no encontrado');
  });

  it('rechaza compras inválidas sin llamar a la API', async () => {
    const carga = service.cargarDatos();
    responderCarga();
    await carga;

    const base = { proveedorId: 2, insumoId: 2, cantidad: 10, precioUnitario: 8.9 };

    await expect(service.registrarCompra({ ...base, proveedorId: 99 }))
      .rejects.toThrowError('El proveedor seleccionado no existe.');
    await expect(service.registrarCompra({ ...base, insumoId: 99 }))
      .rejects.toThrowError('El insumo seleccionado no existe.');
    await expect(service.registrarCompra({ ...base, cantidad: 1.5 }))
      .rejects.toThrowError('La cantidad debe ser un número entero mayor que cero.');
    await expect(service.registrarCompra({ ...base, precioUnitario: 0 }))
      .rejects.toThrowError('El precio unitario debe ser mayor que cero.');

    usuarioActual.set(null);
    await expect(service.registrarCompra(base))
      .rejects.toThrowError('Debe iniciar sesión para registrar compras.');

    http.expectNone(r => r.method === 'POST');
  });
});