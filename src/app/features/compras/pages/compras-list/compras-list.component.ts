import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComprasService } from '../../services/compras.service';

@Component({
  selector: 'app-compras-list',
  imports: [DatePipe, DecimalPipe, RouterLink],
  templateUrl: './compras-list.component.html',
  styleUrl: './compras-list.component.css'
})
export class ComprasListComponent implements OnInit {
  private comprasService = inject(ComprasService);

  protected insumos = this.comprasService.insumos;
  protected cargando = this.comprasService.cargando;
  protected errorCarga = this.comprasService.errorCarga;

  protected filtroInsumoId = signal(0);

  protected filas = computed(() =>
    [...this.comprasService.compras()]
      .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)) || b.id - a.id)
      .map(compra => ({
        compra: compra,
        proveedor: this.comprasService.nombreProveedor(compra.proveedorId),
        insumo: this.comprasService.nombreInsumo(compra.insumoId),
        total: Math.round(compra.cantidad * compra.precioUnitario * 100) / 100
      }))
  );

  ngOnInit(): void {
    // Pide al backend las compras y los insumos
    this.comprasService.cargarDatos(this.filtroInsumoId());
  }

  // Usa GET /api/compras/por-insumo cuando se elige un insumo
  protected filtrarPorInsumo(valor: string): void {
    this.filtroInsumoId.set(Number(valor));
    this.comprasService.cargarDatos(this.filtroInsumoId());
  }

  protected recargar(): void {
    this.comprasService.cargarDatos(this.filtroInsumoId());
  }
}