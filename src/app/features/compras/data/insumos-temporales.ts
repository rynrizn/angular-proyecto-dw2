import { Insumo } from '../../../models';

// TEMPORAL: reemplazar por el InventarioService del Integrante 2 cuando esté integrado
export type InsumoBasico = Pick<Insumo, 'id' | 'nombre' | 'unidadMedida'>;

// Copia de los insumos de carpintería que usa el Integrante 2 (inventario.service.ts)
export const INSUMOS_TEMPORALES: InsumoBasico[] = [
  { id: 1, nombre: 'Madera de Pino', unidadMedida: 'm³' },
  { id: 2, nombre: 'Tornillos para Madera 3"', unidadMedida: 'caja' },
  { id: 3, nombre: 'Clavos de Acero', unidadMedida: 'kg' },
  { id: 4, nombre: 'Laca para Madera', unidadMedida: 'L' },
  { id: 5, nombre: 'Barniz Al Agua', unidadMedida: 'L' },
  { id: 6, nombre: 'Lija P120', unidadMedida: 'hojas' }
];