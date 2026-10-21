import { Insumo } from './insumo.model';
import { OrdenProduccion } from './orden-produccion.model';

export interface Merma {
  id: number;
  insumoId: number;
  insumo?: Insumo;
  ordenProduccionId: number;
  ordenProduccion?: OrdenProduccion;
  cantidadPerdida: number;
  motivo: string;
}

export type CreateMermaDto = Omit<Merma, 'id' | 'insumo' | 'ordenProduccion'>;
export type UpdateMermaDto = Partial<CreateMermaDto>;
