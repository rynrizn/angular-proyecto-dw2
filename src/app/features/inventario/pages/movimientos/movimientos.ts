import { Component, computed, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MovimientoService } from '../../services/movimiento';
import { ProductoService } from '../../services/producto';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './movimientos.html',
  styleUrl: './movimientos.css',
})
export class Movimientos {
  private movimientoService = inject(MovimientoService);
  private productoService = inject(ProductoService);
  private fb = inject(FormBuilder);

  filtroTipo = signal('');
  busquedaProducto = signal('');
  mensaje = signal('');
  mensajeError = signal('');
  submitted = signal(false);

  productos = this.productoService.productos;
  movimientos = this.movimientoService.movimientos;

  movimientosFiltrados = computed(() => {
    const tipo = this.filtroTipo();
    const busq = this.busquedaProducto().toLowerCase();

    return this.movimientos().filter((m) => {
      const coincideTipo = !tipo || m.tipo === tipo;
      if (!busq) return coincideTipo;
      const p = this.productoService.getById(m.productoId);
      const coincideBusq = p
        ? p.nombre.toLowerCase().includes(busq) ||
          p.codigo.toLowerCase().includes(busq)
        : false;
      return coincideTipo && coincideBusq;
    });
  });

  form = this.fb.group({
    productoId: [null as number | null, [Validators.required]],
    tipo: ['', [Validators.required]],
    cantidad: [
      null as number | null,
      [Validators.required, Validators.min(1)],
    ],
    motivo: [''],
  });

  get f() {
    return this.form.controls;
  }

  getNombreProducto(id: number): string {
    const p = this.productoService.getById(id);
    return p ? `${p.codigo} - ${p.nombre}` : `Producto #${id}`;
  }

  getStockDisponible(): number {
    const id = this.form.value.productoId;
    if (!id) return 0;
    const p = this.productoService.getById(Number(id));
    return p ? p.stock : 0;
  }

  registrar(): void {
    this.submitted.set(true);
    this.mensaje.set('');
    this.mensajeError.set('');

    if (this.form.invalid) return;

    const { productoId, tipo, cantidad, motivo } = this.form.value;

    const data = {
      productoId: Number(productoId),
      cantidad: Number(cantidad),
      fecha: new Date().toISOString().split('T')[0],
      motivo: motivo?.trim() || '',
    };

    let resultado: { ok: boolean; error?: string };

    if (tipo === 'entrada') {
      resultado = this.movimientoService.registrarEntrada(data);
    } else {
      resultado = this.movimientoService.registrarSalida(data);
    }

    if (resultado.ok) {
      this.mensaje.set('✔ Movimiento registrado correctamente.');
      this.form.reset({ productoId: null, tipo: '', cantidad: null, motivo: '' });
      this.submitted.set(false);
    } else {
      this.mensajeError.set(resultado.error ?? 'Error al registrar el movimiento.');
    }
  }

  cambiarFiltroTipo(event: Event): void {
    this.filtroTipo.set((event.target as HTMLSelectElement).value);
  }

  cambiarBusqueda(event: Event): void {
    this.busquedaProducto.set((event.target as HTMLInputElement).value);
  }
}
