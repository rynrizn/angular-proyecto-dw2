export interface Movimiento {
  id: number;
  productoId: number;
  tipo: 'entrada' | 'salida';
  cantidad: number;
  fecha: string;
  motivo: string;
}
export type CreateMovimiento = Omit<Movimiento, 'id'>;