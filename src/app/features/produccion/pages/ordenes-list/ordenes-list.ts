import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProduccionService } from '../../services/produccion.service';
import { EstadoOrden } from '../../../../models/orden-produccion.model';

@Component({
  selector: 'app-ordenes-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ordenes-list.html',
  styleUrl: './ordenes-list.css',
})
export class OrdenesList {
  produccionService = inject(ProduccionService);
  filtroEstado = signal<string>('TODOS');

  // ordenes filtradas segun estado
  ordenesFiltradas = computed(() => {
    const estado = this.filtroEstado();
    const lista = this.produccionService.ordenes();
    if (estado === 'TODOS') return lista;
    return lista.filter((o) => o.estado === estado);
  });

  // cambiar estado de una orden
  cambiarEstado(id: number, estado: EstadoOrden) : void {
    this.produccionService.cambiarEstadoOrden(id, estado);
  }
}
