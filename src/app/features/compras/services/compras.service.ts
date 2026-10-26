import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth-service';
import { CompraInsumo, CreateProveedorDto, Insumo, Proveedor, UpdateProveedorDto } from '../../../models';

// Dirección del backend (se configura en src/environments/environment.ts)
const API_URL = `${environment.apiUrl}/api`;

// Datos que necesita el backend para registrar una compra (un insumo por compra)
export interface NuevaCompra {
  proveedorId: number;
  insumoId: number;
  cantidad: number;
  precioUnitario: number;
}

// Convierte un error HTTP en un mensaje que el usuario pueda entender
function mensajeDeError(error: unknown, porDefecto: string): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Revise que el backend esté encendido.';
    }
    // El backend responde los errores como texto simple (BadRequest("mensaje"))
    if (typeof error.error === 'string' && error.error !== '') {
      return error.error;
    }
  }
  return porDefecto;
}

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private proveedoresSignal = signal<Proveedor[]>([
    { id: 1, nombreEmpresa: 'Maderera Los Andes S.R.L.', contacto: 'Carlos Mamani', telefono: '70123456' },
    { id: 2, nombreEmpresa: 'Ferretería El Tornillo', contacto: 'Rosa Quispe', telefono: '71234567' },
    { id: 3, nombreEmpresa: 'Pinturas y Barnices del Sur', contacto: 'Luis Fernández', telefono: '72345678' },
    { id: 4, nombreEmpresa: 'Abrasivos y Herramientas Tarija', contacto: 'Marta Vaca', telefono: '73456789' }
  ]);

  private comprasSignal = signal<CompraInsumo[]>([]);
  private insumosSignal = signal<Insumo[]>([]);

  public proveedores = this.proveedoresSignal.asReadonly();
  public compras = this.comprasSignal.asReadonly();
  public insumos = this.insumosSignal.asReadonly();

  // Estado de la carga, para mostrar "Cargando..." o un error en pantalla
  public cargando = signal(false);
  public errorCarga = signal('');

  // ---------- Proveedores (locales, sin API) ----------

  crearProveedor(datos: CreateProveedorDto): Proveedor {
    this.validarNombreUnico(datos.nombreEmpresa);
    const nuevoId = Math.max(0, ...this.proveedoresSignal().map(p => p.id)) + 1;
    const nuevo: Proveedor = { ...datos, id: nuevoId };
    this.proveedoresSignal.update(lista => [...lista, nuevo]);
    return nuevo;
  }

  actualizarProveedor(id: number, cambios: UpdateProveedorDto): void {
    if (cambios.nombreEmpresa !== undefined) {
      this.validarNombreUnico(cambios.nombreEmpresa, id);
    }
    this.proveedoresSignal.update(lista =>
      lista.map(p => (p.id === id ? { ...p, ...cambios } : p))
    );
  }

  obtenerProveedor(id: number): Proveedor | undefined {
    return this.proveedoresSignal().find(p => p.id === id);
  }

  nombreProveedor(id: number): string {
    if (id === 0) {
      return 'Sin proveedor';
    }
    return this.obtenerProveedor(id)?.nombreEmpresa ?? 'Proveedor desconocido';
  }

  private validarNombreUnico(nombre: string, idExcluido?: number): void {
    const buscado = nombre.trim().toLowerCase();
    const repetido = this.proveedoresSignal().some(
      proveedor => proveedor.id !== idExcluido && proveedor.nombreEmpresa.trim().toLowerCase() === buscado
    );
    if (repetido) {
      throw new Error('Ya existe un proveedor con ese nombre.');
    }
  }

  // ---------- Insumos y compras (con API) ----------

  nombreInsumo(id: number): string {
    return this.insumosSignal().find(insumo => insumo.id === id)?.nombre ?? 'Insumo #' + id;
  }

  // Pide al backend los insumos y las compras.
  async cargarDatos(insumoId = 0): Promise<void> {
    this.cargando.set(true);
    this.errorCarga.set('');

    try {
      const [compras, insumos] = await Promise.all([
        firstValueFrom(
          insumoId > 0
            ? this.http.get<CompraInsumo[]>(`${API_URL}/compras/por-insumo`, { params: { insumoId } })
            : this.http.get<CompraInsumo[]>(`${API_URL}/compras`)
        ),
        firstValueFrom(this.http.get<Insumo[]>(`${API_URL}/insumos`))
      ]);

      this.comprasSignal.set(compras);
      this.insumosSignal.set(insumos);
    } catch (error) {
      this.errorCarga.set(mensajeDeError(error, 'No se pudieron cargar los datos del servidor.'));
    } finally {
      this.cargando.set(false);
    }
  }

  async registrarCompra(datos: NuevaCompra): Promise<void> {
    const usuario = this.authService.usuarioActual();

    if (!usuario) {
      throw new Error('Debe iniciar sesión para registrar compras.');
    }
    if (!this.obtenerProveedor(datos.proveedorId)) {
      throw new Error('El proveedor seleccionado no existe.');
    }
    if (!this.insumosSignal().some(insumo => insumo.id === datos.insumoId)) {
      throw new Error('El insumo seleccionado no existe.');
    }
    if (!Number.isInteger(datos.cantidad) || datos.cantidad <= 0) {
      throw new Error('La cantidad debe ser un número entero mayor que cero.');
    }
    if (datos.precioUnitario <= 0) {
      throw new Error('El precio unitario debe ser mayor que cero.');
    }

    try {
      await firstValueFrom(
        this.http.post(`${API_URL}/compras`, {
          usuarioId: usuario.id,
          insumoId: datos.insumoId,
          proveedorId: datos.proveedorId,
          precioUnitario: datos.precioUnitario,
          cantidad: datos.cantidad
        })
      );
    } catch (error) {
      throw new Error(mensajeDeError(error, 'No se pudo registrar la compra.'));
    }

    // Vuelve a pedir los datos para ver la compra nueva y el stock actualizado
    await this.cargarDatos();
  }
}