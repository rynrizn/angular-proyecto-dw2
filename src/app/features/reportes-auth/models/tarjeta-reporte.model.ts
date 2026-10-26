export interface TarjetaReporte {
  titulo: string;
  dotColor: string;

  columnas: {
    texto: string;
    alignRight?: boolean;
  }[];

  filas: {
    celdas: {
      valor: string;
      colorClass?: string;
      alignRight?: boolean;
    }[];
  }[];

  grafico?: {
    type: 'bar' | 'doughnut' | 'line';
    data: any;       // Aquí viaja [data]="datosInsumos"
    options?: any;   // Aquí viaja [options]="opcionesInsumos"
    containerClass?: string; // Para controlar clases de tamaño (ej. h-48 o w-36 h-36)
  };
}