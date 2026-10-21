import { Usuario } from './usuario.model';
import { Insumo } from './insumo.model';
import { Proveedor } from './proveedor.model';

export interface CompraInsumo {
  id: number;
  usuarioId: number;
  usuario?: Usuario;
  insumoId: number;
  insumo?: Insumo;
  proveedorId: number;
  proveedor?: Proveedor;
  fecha: string | Date;
  precioUnitario: number;
  cantidad: number;
}

export type CreateCompraInsumoDto = Omit<CompraInsumo, 'id' | 'usuario' | 'insumo' | 'proveedor'>;
export type UpdateCompraInsumoDto = Partial<CreateCompraInsumoDto>;
