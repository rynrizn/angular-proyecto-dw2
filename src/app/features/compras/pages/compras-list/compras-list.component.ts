import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { INSUMOS_TEMPORALES } from '../../data/insumos-temporales';
import { ComprasService } from '../../services/compras.service';

@Component({
  selector: 'app-compras-list',
  imports: [DatePipe, DecimalPipe, RouterLink],
  templateUrl: './compras-list.component.html',
  styleUrl: './compras-list.component.css'
})
export class ComprasListComponent {
  private comprasService = inject(ComprasService);

  protected proveedores = this.comprasService.proveedores;

  protected filtroProveedorId = signal(0);

  protected compraAbiertaId = signal<number | null>(null);

  // Filas de la tabla: compras filtradas, de la más reciente a la más antigua
  protected filas = computed(() => {
    const filtro = this.filtroProveedorId();

    return this.comprasService
      .compras()
      .filter(compra => filtro === 0 || compra.proveedorId === filtro)
      .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id)
      .map(compra => ({
        compra: compra,
        proveedor: this.comprasService.nombreProveedor(compra.proveedorId),
        total: this.comprasService.totalDe(compra)
      }));
  });

  protected filtrarPorProveedor(valor: string): void {
    this.filtroProveedorId.set(Number(valor));
    this.compraAbiertaId.set(null);
  }

  protected alternarDetalle(id: number): void {
    this.compraAbiertaId.set(this.compraAbiertaId() === id ? null : id);
  }

  // TEMPORAL: reemplazar por el InventarioService del Integrante 2
  protected nombreInsumo(id: number): string {
    return INSUMOS_TEMPORALES.find(insumo => insumo.id === id)?.nombre ?? 'Insumo #' + id;
  }
}