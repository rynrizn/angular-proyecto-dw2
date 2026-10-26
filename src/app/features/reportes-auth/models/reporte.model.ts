export interface InsumoSalidaDto {
  insumo: string;
  cantidadGastada: number;
}

export interface BalanceProduccionDto {
  estado: string;
  total: number;
}

export interface ResumenMermaDto {
  insumo: string;
  cantidadPerdida: number;
  costoTotal: number;
}

export interface ReporteDataDto {
  insumosSalida: InsumoSalidaDto[];
  balanceProduccion: BalanceProduccionDto[];
  resumenEconomicoMermas: ResumenMermaDto[];
}

export interface ApiResponseDto {
  mensaje: string;
  data: ReporteDataDto;
}