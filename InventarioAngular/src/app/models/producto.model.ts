import { OrdenProduccion } from './orden-produccion.model';

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  ordenesProduccion?: OrdenProduccion[];
}

export type CreateProductoDto = Omit<Producto, 'id' | 'ordenesProduccion'>;
export type UpdateProductoDto = Partial<CreateProductoDto>;
