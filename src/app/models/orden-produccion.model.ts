import { Usuario } from './usuario.model';
import { Producto } from './producto.model';
import { Merma } from './merma.model';

export type EstadoOrden = 'Pendiente' | 'En Proceso' | 'Completado' | 'Cancelado' | string;

export interface OrdenProduccion {
  id: number;
  usuarioId: number;
  usuario?: Usuario;
  productoId: number;
  producto?: Producto;
  fecha: string | Date;
  cantidadSolicitada: number;
  estado: EstadoOrden;
  mermas?: Merma[];
}

export type CreateOrdenProduccionDto = Omit<OrdenProduccion, 'id' | 'usuario' | 'producto' | 'mermas'>;
export type UpdateEstadoOrdenDto = {
  estado: EstadoOrden;
};
