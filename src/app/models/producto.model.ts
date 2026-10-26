import { OrdenProduccion } from './orden-produccion.model';

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  unidad: string;
  stock: number;
  stockMinimo: number;
  precio: number;
  descripcion?: string;
  ordenesProduccion?: OrdenProduccion[];
}

export type CreateProducto = Omit<Producto, 'id'>;
export type UpdateProducto = Partial<CreateProducto>;