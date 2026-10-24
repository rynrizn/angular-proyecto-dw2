import { CompraInsumo } from '../../../models';

// Una fila del detalle: solo lo que cambia en cada insumo comprado
export type LineaCompra = Pick<CompraInsumo, 'insumoId' | 'cantidad' | 'precioUnitario'>;

// Una compra completa: cabecera + varias líneas (tipo local, no existe en el backend)
export interface CompraFactura {
  id: number;
  usuarioId: number;
  proveedorId: number;
  fecha: string;
  lineas: LineaCompra[];
}

// Lo que el formulario envía al registrar: todo menos el id
export type NuevaCompraFactura = Omit<CompraFactura, 'id'>;