import { TestBed } from '@angular/core/testing';
import { ComprasService } from './compras.service';

describe('ComprasService', () => {
  let service: ComprasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComprasService);
  });

  it('carga los 3 proveedores y 3 compras del seed', () => {
    expect(service.proveedores().length).toBe(3);
    expect(service.compras().length).toBe(3);
  });

  it('crea un proveedor con el siguiente id', () => {
    const nuevo = service.crearProveedor({ nombreEmpresa: 'Prueba S.A.', contacto: 'Ana', telefono: '7000' });
    expect(nuevo.id).toBe(4);
    expect(service.proveedores().length).toBe(4);
  });

  it('actualiza solo los campos enviados', () => {
    service.actualizarProveedor(1, { telefono: '99999999' });
    expect(service.obtenerProveedor(1)?.telefono).toBe('99999999');
    expect(service.obtenerProveedor(1)?.contacto).toBe('Pedro Sanchez');
  });

  it('calcula el total de una compra con varias líneas', () => {
    const compra = service.registrarCompra({
      usuarioId: 1,
      proveedorId: 1,
      fecha: new Date().toISOString(),
      lineas: [
        { insumoId: 1, cantidad: 10, precioUnitario: 4.5 },
        { insumoId: 2, cantidad: 2, precioUnitario: 5 }
      ]
    });
    expect(service.totalDe(compra)).toBe(55);
    expect(compra.id).toBe(4);
  });
});