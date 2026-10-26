import { Component, inject, signal } from '@angular/core';
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
export class MermasList {
  produccionService = inject(ProduccionService);

  ordenProduccionId = signal<number>(101);
  insumoId = signal<number>(1);
  cantidadPerdida = signal<number>(1);
  motivo = signal<string>('');

  // registrar merma y descontar inventario
  registrar() : void {
    if (this.cantidadPerdida() <= 0 || !this.motivo().trim()) return;

    this.produccionService.registrarMerma({
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
