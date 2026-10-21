import { OrdenProduccion } from './orden-produccion.model';
import { CompraInsumo } from './compra-insumo.model';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  contraseña?: string;
  rol: string;
  ordenesProduccion?: OrdenProduccion[];
  comprasInsumo?: CompraInsumo[];
}

export type CreateUsuarioDto = Omit<Usuario, 'id' | 'ordenesProduccion' | 'comprasInsumo'>;
export type UpdateUsuarioDto = Partial<CreateUsuarioDto>;
