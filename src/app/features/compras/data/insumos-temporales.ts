import { Insumo } from '../../../models';

// TEMPORAL: reemplazar por el InventarioService del Integrante 2 cuando esté disponible
export type InsumoBasico = Pick<Insumo, 'id' | 'nombre' | 'unidadMedida'>;

// Datos tomados de sql/seed.sql
export const INSUMOS_TEMPORALES: InsumoBasico[] = [
  { id: 1, nombre: 'Harina de Trigo Especial', unidadMedida: 'kg' },
  { id: 2, nombre: 'Azúcar Refinada', unidadMedida: 'kg' },
  { id: 3, nombre: 'Levadura Seca', unidadMedida: 'kg' },
  { id: 4, nombre: 'Mantequilla Industrial', unidadMedida: 'kg' },
  { id: 5, nombre: 'Sal Yodada', unidadMedida: 'kg' }
];