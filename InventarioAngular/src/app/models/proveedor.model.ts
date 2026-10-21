import { CompraInsumo } from './compra-insumo.model';

export interface Proveedor {
  id: number;
  nombreEmpresa: string;
  contacto: string;
  telefono: string;
  insumosProvee?: CompraInsumo[];
}

export type CreateProveedorDto = Omit<Proveedor, 'id' | 'insumosProvee'>;
export type UpdateProveedorDto = Partial<CreateProveedorDto>;
