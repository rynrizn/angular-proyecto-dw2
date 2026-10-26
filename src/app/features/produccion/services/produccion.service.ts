import { computed, inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth-service';
import { Insumo } from '../../../models/insumo.model';
import { Producto } from '../../../models/producto.model';
import { Receta } from '../../../models/receta.model';
import { RecetaDetalle } from '../../../models/receta-detalle.model';
import { OrdenProduccion, EstadoOrden } from '../../../models/orden-produccion.model';
import { Merma } from '../../../models/merma.model';

// direccion de la api backend c#
const API_URL = `${environment.apiUrl}/api`;

@Service()
export class ProduccionService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // estado de carga y mensajes
  cargando = signal<boolean>(false);
  mensajeError = signal<string>('');

  // insumos iniciales basados en sql/seed-carpinteria.sql
  private listaInsumos = signal<Insumo[]>([
    { id: 1, nombre: 'Madera de Pino', unidadMedida: 'm³', stockActual: 25, stockMinimo: 10, costoPromedio: 45.50 },
    { id: 2, nombre: 'Tornillos para Madera 3"', unidadMedida: 'caja', stockActual: 50, stockMinimo: 20, costoPromedio: 8.90 },
    { id: 3, nombre: 'Clavos de Acero', unidadMedida: 'kg', stockActual: 100, stockMinimo: 30, costoPromedio: 5.20 },
    { id: 4, nombre: 'Laca para Madera', unidadMedida: 'L', stockActual: 15, stockMinimo: 5, costoPromedio: 32.00 },
    { id: 5, nombre: 'Barniz Al Agua', unidadMedida: 'L', stockActual: 8, stockMinimo: 3, costoPromedio: 45.00 },
    { id: 6, nombre: 'Lija P120', unidadMedida: 'hojas', stockActual: 200, stockMinimo: 50, costoPromedio: 1.80 }
  ]);

  // productos que fabrica el taller
  private listaProductos = signal<Producto[]>([
    { id: 1, codigo: 'PROD-001', nombre: 'Mesa de Comedor', categoria: 'Muebles', unidad: 'unidad', stock: 4, stockMinimo: 2, precio: 1800, descripcion: 'Mesa de madera de pino 6 puestos' },
    { id: 2, codigo: 'PROD-002', nombre: 'Silla de Algarrobo', categoria: 'Muebles', unidad: 'unidad', stock: 10, stockMinimo: 4, precio: 450, descripcion: 'Silla de madera reforzada' },
    { id: 3, codigo: 'PROD-003', nombre: 'Estante de Pared', categoria: 'Muebles', unidad: 'unidad', stock: 8, stockMinimo: 3, precio: 220, descripcion: 'Estante flotante de pino' }
  ]);

  // recetas bom con cantidades por producto
  private listaRecetas = signal<Receta[]>([
    {
      id: 1,
      productoId: 1,
      detalle: [
        { id: 1, recetaId: 1, insumoId: 1, cantidadNecesaria: 3 },
        { id: 2, recetaId: 1, insumoId: 2, cantidadNecesaria: 1 },
        { id: 3, recetaId: 1, insumoId: 4, cantidadNecesaria: 1 },
        { id: 4, recetaId: 1, insumoId: 5, cantidadNecesaria: 1 }
      ]
    },
    {
      id: 2,
      productoId: 2,
      detalle: [
        { id: 5, recetaId: 2, insumoId: 1, cantidadNecesaria: 1 },
        { id: 6, recetaId: 2, insumoId: 2, cantidadNecesaria: 1 },
        { id: 7, recetaId: 2, insumoId: 5, cantidadNecesaria: 1 }
      ]
    },
    {
      id: 3,
      productoId: 3,
      detalle: [
        { id: 8, recetaId: 3, insumoId: 1, cantidadNecesaria: 1 },
        { id: 9, recetaId: 3, insumoId: 2, cantidadNecesaria: 1 },
        { id: 10, recetaId: 3, insumoId: 6, cantidadNecesaria: 2 }
      ]
    }
  ]);

  // ordenes de produccion iniciales
  private listaOrdenes = signal<OrdenProduccion[]>([
    {
      id: 1,
      usuarioId: 2,
      productoId: 1,
      cantidadSolicitada: 50,
      fecha: '2026-10-23',
      estado: 'Completado'
    },
    {
      id: 2,
      usuarioId: 2,
      productoId: 1,
      cantidadSolicitada: 100,
      fecha: '2026-10-24',
      estado: 'En Proceso'
    },
    {
      id: 3,
      usuarioId: 2,
      productoId: 2,
      cantidadSolicitada: 80,
      fecha: '2026-10-25',
      estado: 'Pendiente'
    }
  ]);

  // mermas registradas
  private listaMermas = signal<Merma[]>([
    {
      id: 1,
      insumoId: 1,
      ordenProduccionId: 1,
      cantidadPerdida: 2,
      motivo: 'Madera astillada en corte de taller'
    },
    {
      id: 2,
      insumoId: 4,
      ordenProduccionId: 2,
      cantidadPerdida: 1,
      motivo: 'Derrame de laca en zona de barnizado'
    }
  ]);

  // senales publicas de solo lectura
  readonly insumos = this.listaInsumos.asReadonly();
  readonly productos = this.listaProductos.asReadonly();
  readonly recetas = this.listaRecetas.asReadonly();
  readonly ordenes = this.listaOrdenes.asReadonly();
  readonly mermas = this.listaMermas.asReadonly();

  // conteo de ordenes activas
  totalOrdenesActivas = computed(() =>
    this.listaOrdenes().filter((o) => o.estado === 'En Proceso' || o.estado === 'Pendiente' || o.estado === 'Procesada').length
  );

  // cargar datos desde el backend c#
  async cargarDatos(): Promise<void> {
    this.cargando.set(true);
    this.mensajeError.set('');

    try {
      const [ordenesApi, productosApi, insumosApi, mermasApi] = await Promise.all([
        firstValueFrom(this.http.get<OrdenProduccion[]>(`${API_URL}/OrdenProduccion`)).catch(() => null),
        firstValueFrom(this.http.get<any[]>(`${API_URL}/Productos`)).catch(() => null),
        firstValueFrom(this.http.get<Insumo[]>(`${API_URL}/Insumos`)).catch(() => null),
        firstValueFrom(this.http.get<Merma[]>(`${API_URL}/Merma`)).catch(() => null)
      ]);

      if (ordenesApi && ordenesApi.length > 0) {
        this.listaOrdenes.set(ordenesApi);
      }
      if (insumosApi && insumosApi.length > 0) {
        this.listaInsumos.set(insumosApi);
      }
      if (mermasApi && mermasApi.length > 0) {
        this.listaMermas.set(mermasApi);
      }
      if (productosApi && productosApi.length > 0) {
        const adaptados: Producto[] = productosApi.map((p) => ({
          id: p.id,
          codigo: p.codigo || `PROD-${p.id}`,
          nombre: p.nombre,
          categoria: p.categoria || 'Muebles',
          unidad: p.unidad || 'unidad',
          stock: p.stock ?? 0,
          stockMinimo: p.stockMinimo ?? 0,
          precio: p.precio,
          descripcion: p.descripcion || ''
        }));
        this.listaProductos.set(adaptados);

        await this.cargarRecetasParaProductos(adaptados);
      }
    } catch {
      // si falla la conexion usamos el respaldo local
      this.mensajeError.set('No se pudo conectar con el backend. usando datos de respaldo.');
    } finally {
      this.cargando.set(false);
    }
  }

  // cargar recetas de la api para los productos encontrados
  private async cargarRecetasParaProductos(prods: Producto[]): Promise<void> {
    try {
      const recetasCargadas: Receta[] = [];
      for (const prod of prods) {
        try {
          const detalles = await firstValueFrom(
            this.http.get<RecetaDetalle[]>(`${API_URL}/recetas/${prod.id}/detalles`)
          );
          if (detalles && detalles.length > 0) {
            recetasCargadas.push({
              id: prod.id,
              productoId: prod.id,
              detalle: detalles
            });
          }
        } catch {
          // continuar con el siguiente si este no tiene receta
        }
      }
      if (recetasCargadas.length > 0) {
        this.listaRecetas.set(recetasCargadas);
      }
    } catch {
      // mantener recetas locales
    }
  }

  // crear nueva orden de fabricacion
  async crearOrden(productoId: number, cantidad: number): Promise<{ ok: boolean; mensaje: string; alertas?: string[] }> {
    const usuarioId = this.authService.usuarioActual()?.id ?? 1;

    try {
      const res = await firstValueFrom(
        this.http.post<{ mensaje: string; alertas?: string[] }>(
          `${API_URL}/OrdenProduccion`,
          null,
          {
            params: {
              productoId: productoId.toString(),
              cantidad: cantidad.toString(),
              usuarioId: usuarioId.toString()
            }
          }
        )
      );

      await this.cargarDatos();
      return { ok: true, mensaje: res.mensaje || 'orden creada correctamente', alertas: res.alertas };
    } catch (error: any) {
      // registro local de respaldo
      const nuevoId = Math.max(0, ...this.listaOrdenes().map((o) => o.id)) + 1;
      const nuevaOrden: OrdenProduccion = {
        id: nuevoId,
        usuarioId: usuarioId,
        productoId: productoId,
        cantidadSolicitada: cantidad,
        fecha: new Date().toISOString().split('T')[0],
        estado: 'Pendiente'
      };
      this.listaOrdenes.update((ordenes) => [nuevaOrden, ...ordenes]);

      const msg = typeof error?.error === 'string' ? error.error : 'orden registrada localmente';
      return { ok: true, mensaje: msg };
    }
  }

  // cambiar estado de una orden
  async cambiarEstadoOrden(ordenId: number, nuevoEstado: EstadoOrden): Promise<void> {
    this.listaOrdenes.update((ordenes) =>
      ordenes.map((orden) => (orden.id === ordenId ? { ...orden, estado: nuevoEstado } : orden))
    );

    try {
      await firstValueFrom(
        this.http.patch(
          `${API_URL}/OrdenProduccion/${ordenId}/estado`,
          null,
          {
            params: { estado: nuevoEstado }
          }
        )
      );
    } catch {
      // ya se actualizo localmente
    }
  }

  // registrar merma y descontar materia prima
  async registrarMerma(nueva: { insumoId: number; ordenProduccionId: number; cantidadPerdida: number; motivo: string }): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${API_URL}/Merma`, {
          insumoId: nueva.insumoId,
          ordenProduccionId: nueva.ordenProduccionId,
          cantidadPerdida: nueva.cantidadPerdida,
          motivo: nueva.motivo
        })
      );
      await this.cargarDatos();
    } catch {
      // respaldo en memoria
      const nuevoId = Math.max(0, ...this.listaMermas().map((m) => m.id)) + 1;
      this.listaMermas.update((mermas) => [{ ...nueva, id: nuevoId }, ...mermas]);

      this.listaInsumos.update((insumos) =>
        insumos.map((ins) =>
          ins.id === nueva.insumoId
            ? { ...ins, stockActual: Math.max(0, Number((ins.stockActual - nueva.cantidadPerdida).toFixed(2))) }
            : ins
        )
      );
    }
  }

  // buscar receta por id de producto
  obtenerRecetaPorProducto(productoId: number): Receta | undefined {
    return this.listaRecetas().find((r) => r.productoId === productoId);
  }

  // buscar insumo por id
  obtenerInsumoPorId(insumoId: number): Insumo | undefined {
    return this.listaInsumos().find((i) => i.id === insumoId);
  }

  // buscar producto por id
  obtenerProductoPorId(productoId: number): Producto | undefined {
    return this.listaProductos().find((p) => p.id === productoId);
  }
}
