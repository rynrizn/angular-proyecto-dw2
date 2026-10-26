import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProduccionService } from '../../services/produccion.service';

@Component({
  selector: 'app-nueva-orden',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './nueva-orden.html',
  styleUrl: './nueva-orden.css',
})
export class NuevaOrden {
  produccionService = inject(ProduccionService);
  private router = inject(Router);

  productoSeleccionadoId = signal<number>(1);
  cantidad = signal<number>(5);

  // receta del producto elegido
  recetaActual = computed(() =>
    this.produccionService.obtenerRecetaPorProducto(Number(this.productoSeleccionadoId()))
  );

  // calculo en vivo de requerimientos vs stock
  requerimientos = computed(() => {
    const receta = this.recetaActual();
    const cant = this.cantidad();
    if (!receta || !receta.detalle) return [];

    return receta.detalle.map((det) => {
      const insumo = this.produccionService.obtenerInsumoPorId(det.insumoId);
      const necesario = Number((det.cantidadNecesaria * cant).toFixed(2));
      const disponible = insumo ? insumo.stockActual : 0;
      const suficiente = disponible >= necesario;

      return {
        insumoNombre: insumo ? insumo.nombre : 'Insumo #' + det.insumoId,
        unidad: insumo ? insumo.unidadMedida : 'u',
        cantidadPorUnidad: det.cantidadNecesaria,
        totalNecesario: necesario,
        stockDisponible: disponible,
        suficiente,
      };
    });
  });

  // verifica si alcanza la materia prima
  puedeFabricar = computed(() => {
    const reqs = this.requerimientos();
    return reqs.length > 0 && reqs.every((r) => r.suficiente) && this.cantidad() > 0;
  });

  // guardar orden nueva
  guardarOrden() : void {
    if (!this.puedeFabricar()) return;

    this.produccionService.crearOrden({
      usuarioId: 1,
      productoId: Number(this.productoSeleccionadoId()),
      cantidadSolicitada: this.cantidad(),
      fecha: new Date().toISOString().split('T')[0],
      estado: 'Pendiente',
    });

    this.router.navigate(['/produccion/ordenes']);
  }
}
