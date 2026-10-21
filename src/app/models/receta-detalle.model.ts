import { Receta } from './receta.model';
import { Insumo } from './insumo.model';

export interface RecetaDetalle {
  id: number;
  recetaId: number;
  receta?: Receta;
  insumoId: number;
  insumo?: Insumo;
  cantidadNecesaria: number;
}

export type CreateRecetaDetalleDto = Omit<RecetaDetalle, 'id' | 'receta' | 'insumo'>;
export type UpdateRecetaDetalleDto = Partial<CreateRecetaDetalleDto>;
