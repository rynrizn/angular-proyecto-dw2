import { Producto } from './producto.model';
import { RecetaDetalle } from './receta-detalle.model';

export interface Receta {
  id: number;
  productoId: number;
  producto?: Producto;
  detalle?: RecetaDetalle[];
}

export type CreateRecetaDto = Omit<Receta, 'id' | 'producto' | 'detalle'>;
