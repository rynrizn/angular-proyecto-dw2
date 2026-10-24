export interface ProductoResumen {
  id: number,
  nombre: string,
  stock: number,
  stockMinimo: number
}

export interface OrdenResumen {
  id: number,
  producto: string,
  estado: string
}

export interface TarjetaEstadistica {
  titulo: string,
  valor: number,
  alerta: boolean
}