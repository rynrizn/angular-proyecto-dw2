import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProduccionService } from '../../services/produccion.service';

@Component({
  selector: 'app-mermas-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './mermas-list.html',
  styleUrl: './mermas-list.css',
})
export class MermasList implements OnInit {
  produccionService = inject(ProduccionService);

  ordenProduccionId = signal<number>(1);
  insumoId = signal<number>(1);
  cantidadPerdida = signal<number>(1);
  motivo = signal<string>('');

  // cargar historial de mermas e insumos al montar el componente
  ngOnInit(): void {
    this.produccionService.cargarDatos();
  }

  // registrar merma y descontar materia prima
  async registrar(): Promise<void> {
    if (this.cantidadPerdida() <= 0 || !this.motivo().trim()) return;

    await this.produccionService.registrarMerma({
      insumoId: Number(this.insumoId()),
      ordenProduccionId: Number(this.ordenProduccionId()),
      cantidadPerdida: Number(this.cantidadPerdida()),
      motivo: this.motivo().trim(),
    });

    // limpiar formulario
    this.motivo.set('');
    this.cantidadPerdida.set(1);
  }
}
