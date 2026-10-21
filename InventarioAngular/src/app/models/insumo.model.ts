import { RecetaDetalle } from './receta-detalle.model';
import { CompraInsumo } from './compra-insumo.model';
import { Merma } from './merma.model';

export interface Insumo {
  id: number;
  nombre: string;
  unidadMedida: string;
  stockActual: number;
  stockMinimo: number;
  costoPromedio: number;
  recetasDetalle?: RecetaDetalle[];
  compras?: CompraInsumo[];
  mermas?: Merma[];
}

export type CreateInsumoDto = Omit<Insumo, 'id' | 'recetasDetalle' | 'compras' | 'mermas'>;
export type UpdateInsumoDto = Partial<CreateInsumoDto>;

export interface ValidarStockResponse {
  insumoId: number;
  cantidad: number;
  hayStock: boolean;
}
