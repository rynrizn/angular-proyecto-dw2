import { computed, Injectable, signal } from '@angular/core';
import { ProductoResumen, OrdenResumen, TarjetaEstadistica } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class ServicioDashboard {
  private listaProductos = signal<ProductoResumen[]>([
    { id: 1, nombre: 'Pan', stock: 30, stockMinimo: 10 },
    { id: 2, nombre: 'Galletas', stock: 5, stockMinimo: 10 },
    { id: 3, nombre: 'Torta', stock: 2, stockMinimo: 5 },
  ]);

  private listaOrdenes = signal<OrdenResumen[]>([
    { id: 1, producto: 'Pan', estado: 'pendiente' },
    { id: 2, producto: 'Galletas', estado: 'en proceso' },
    { id: 3, producto: 'Torta', estado: 'finalizada' },
  ]);

  totalProductos = computed(() => this.listaProductos().length);
  totalExistencias = computed(() => this.listaProductos().reduce((suma, p) => suma + p.stock, 0));
  productosStockBajo = computed(() => this.listaProductos().filter(p => p.stock <= p.stockMinimo).length);
  ordenesPendientes = computed(() => this.listaOrdenes().filter(o => o.estado === 'pendiente').length);
  ordenesEnProceso = computed(() => this.listaOrdenes().filter(o => o.estado === 'en proceso').length);

  tarjetas = computed<TarjetaEstadistica[]>(() => [
    { titulo: 'Productos', valor: this.totalProductos(), alerta: false },
    { titulo: 'Existencias', valor: this.totalExistencias(), alerta: false },
    { titulo: 'Stock bajo', valor: this.productosStockBajo(), alerta: this.productosStockBajo() > 0 },
    { titulo: 'Órdenes pendientes', valor: this.ordenesPendientes(), alerta: false },
    { titulo: 'Órdenes en proceso', valor: this.ordenesEnProceso(), alerta: false },
  ]);
}