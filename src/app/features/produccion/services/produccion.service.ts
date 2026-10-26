import { computed, Service, signal } from '@angular/core';
import { Insumo } from '../../../models/insumo.model';
import { Producto } from '../../../models/producto.model';
import { Receta } from '../../../models/receta.model';
import { OrdenProduccion, EstadoOrden } from '../../../models/orden-produccion.model';
import { Merma } from '../../../models/merma.model';

@Service()
export class ProduccionService {
  // insumos de carpinteria
  private listaInsumos = signal<Insumo[]>([
    { id: 1, nombre: 'Madera de Pino', unidadMedida: 'pie tablar', stockActual: 150, stockMinimo: 30, costoPromedio: 18.00 },
    { id: 2, nombre: 'Tornillos para Madera 3"', unidadMedida: 'caja', stockActual: 40, stockMinimo: 15, costoPromedio: 35.00 },
    { id: 3, nombre: 'Clavos de Acero', unidadMedida: 'kg', stockActual: 80, stockMinimo: 20, costoPromedio: 5.20 },
    { id: 4, nombre: 'Barniz Marino', unidadMedida: 'galon', stockActual: 15, stockMinimo: 5, costoPromedio: 160.00 },
    { id: 5, nombre: 'Cola Blanca', unidadMedida: 'litro', stockActual: 25, stockMinimo: 8, costoPromedio: 28.00 },
    { id: 6, nombre: 'Lija P120', unidadMedida: 'hojas', stockActual: 120, stockMinimo: 30, costoPromedio: 1.80 }
  ]);

  // productos que fabrica la carpinteria
  private listaProductos = signal<Producto[]>([
    { id: 1, codigo: 'T-001', nombre: 'Mesa de Comedor', categoria: 'Terminados', unidad: 'unidad', stock: 4, stockMinimo: 2, precio: 1800, descripcion: 'Mesa de madera de pino 6 puestos' },
    { id: 2, codigo: 'T-002', nombre: 'Silla de Algarrobo', categoria: 'Terminados', unidad: 'unidad', stock: 10, stockMinimo: 4, precio: 450, descripcion: 'Silla de madera reforzada' },
    { id: 3, codigo: 'C-003', nombre: 'Estante de Pared', categoria: 'Muebles', unidad: 'unidad', stock: 8, stockMinimo: 3, precio: 220, descripcion: 'Estante flotante de pino' }
  ]);

  // recetas con cantidades de insumos por mueble
  private listaRecetas = signal<Receta[]>([
    {
      id: 1,
      productoId: 1,
      detalle: [
        { id: 1, recetaId: 1, insumoId: 1, cantidadNecesaria: 10 },
        { id: 2, recetaId: 1, insumoId: 2, cantidadNecesaria: 1 },
        { id: 3, recetaId: 1, insumoId: 4, cantidadNecesaria: 1 },
        { id: 4, recetaId: 1, insumoId: 5, cantidadNecesaria: 0.5 }
      ]
    },
    {
      id: 2,
      productoId: 2,
      detalle: [
        { id: 5, recetaId: 2, insumoId: 1, cantidadNecesaria: 3 },
        { id: 6, recetaId: 2, insumoId: 2, cantidadNecesaria: 0.5 },
        { id: 7, recetaId: 2, insumoId: 4, cantidadNecesaria: 0.2 },
        { id: 8, recetaId: 2, insumoId: 5, cantidadNecesaria: 0.2 }
      ]
    },
    {
      id: 3,
      productoId: 3,
      detalle: [
        { id: 9, recetaId: 3, insumoId: 1, cantidadNecesaria: 2 },
        { id: 10, recetaId: 3, insumoId: 2, cantidadNecesaria: 0.3 },
        { id: 11, recetaId: 3, insumoId: 4, cantidadNecesaria: 0.3 }
      ]
    }
  ]);

  // ordenes de fabricacion
  private listaOrdenes = signal<OrdenProduccion[]>([
    {
      id: 101,
      usuarioId: 1,
      productoId: 1,
      cantidadSolicitada: 5,
      fecha: '2026-03-20',
      estado: 'En Proceso'
    },
    {
      id: 100,
      usuarioId: 1,
      productoId: 2,
      cantidadSolicitada: 12,
      fecha: '2026-03-18',
      estado: 'Completado'
    },
    {
      id: 99,
      usuarioId: 1,
      productoId: 3,
      cantidadSolicitada: 8,
      fecha: '2026-03-22',
      estado: 'Pendiente'
    }
  ]);

  // mermas o desperdicios de taller
  private listaMermas = signal<Merma[]>([
    {
      id: 1,
      insumoId: 1,
      ordenProduccionId: 101,
      cantidadPerdida: 2,
      motivo: 'Corte defectuoso en sierra circular'
    },
    {
      id: 2,
      insumoId: 4,
      ordenProduccionId: 100,
      cantidadPerdida: 0.5,
      motivo: 'Derrame de barniz en taller'
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
    this.listaOrdenes().filter((o) => o.estado === 'En Proceso' || o.estado === 'Pendiente').length
  );

  // crear nueva orden
  crearOrden(nueva: Omit<OrdenProduccion, 'id'>) : void {
    const nuevoId = Math.max(0, ...this.listaOrdenes().map((o) => o.id)) + 1;
    this.listaOrdenes.update((ordenes) => [{ ...nueva, id: nuevoId }, ...ordenes]);
  }

  // cambiar el estado de una orden
  cambiarEstadoOrden(ordenId: number, nuevoEstado: EstadoOrden) : void {
    this.listaOrdenes.update((ordenes) =>
      ordenes.map((orden) => (orden.id === ordenId ? { ...orden, estado: nuevoEstado } : orden))
    );
  }

  // registrar merma y descontar insumo
  registrarMerma(nueva: Omit<Merma, 'id'>) : void {
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
