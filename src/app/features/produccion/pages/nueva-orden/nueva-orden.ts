import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
export class NuevaOrden implements OnInit {
  produccionService = inject(ProduccionService);
  private router = inject(Router);

  productoSeleccionadoId = signal<number>(1);
  cantidad = signal<number>(5);
  guardando = signal<boolean>(false);
  mensajeAlerta = signal<string>('');

  // cargar datos iniciales si no se han cargado aun
  ngOnInit(): void {
    this.produccionService.cargarDatos();
  }

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

  // guardar orden nueva conectando al backend api
  async guardarOrden(): Promise<void> {
    if (!this.puedeFabricar() || this.guardando()) return;

    this.guardando.set(true);
    this.mensajeAlerta.set('');

    const res = await this.produccionService.crearOrden(
      Number(this.productoSeleccionadoId()),
      Number(this.cantidad())
    );

    this.guardando.set(false);

    if (res.alertas && res.alertas.length > 0) {
      alert(`Orden registrada con alertas:\n${res.alertas.join('\n')}`);
    }

    this.router.navigate(['/produccion/ordenes']);
  }
}
