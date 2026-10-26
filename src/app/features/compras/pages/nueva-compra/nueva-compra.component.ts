import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ComprasService } from '../../services/compras.service';

function redondear(valor: number): number {
  return Math.round(valor * 100) / 100;
}

@Component({
  selector: 'app-nueva-compra',
  imports: [ReactiveFormsModule, DecimalPipe, RouterLink],
  templateUrl: './nueva-compra.component.html',
  styleUrl: './nueva-compra.component.css'
})
export class NuevaCompraComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private comprasService = inject(ComprasService);

  protected proveedores = this.comprasService.proveedores;
  protected insumos = this.comprasService.insumos;
  protected errorCarga = this.comprasService.errorCarga;

  protected mensaje = signal('');
  protected mensajeError = signal('');
  protected guardando = signal(false);

  protected formulario = this.fb.group({
    proveedorId: [0, [Validators.min(1)]],
    insumoId: [0, [Validators.min(1)]],
    cantidad: [1, [Validators.min(1), Validators.pattern('^[0-9]+$')]],
    precioUnitario: [0, [Validators.min(0.01)]]
  });

  // Copia de los valores del formulario como señal, para calcular el total en vivo
  private valores = toSignal(
    this.formulario.valueChanges.pipe(map(() => this.formulario.getRawValue())),
    { initialValue: this.formulario.getRawValue() }
  );

  // Total = cantidad × precio unitario
  protected total = computed(() => {
    const { cantidad, precioUnitario } = this.valores();
    return redondear((cantidad || 0) * (precioUnitario || 0));
  });

  protected insumoElegido = computed(() =>
    this.insumos().find(insumo => insumo.id === this.valores().insumoId)
  );

  ngOnInit(): void {
    // Pide al backend los insumos (y las compras)
    this.comprasService.cargarDatos();
  }

  protected recargar(): void {
    this.comprasService.cargarDatos();
  }

  protected campoInvalido(campo: 'proveedorId' | 'insumoId' | 'cantidad' | 'precioUnitario'): boolean {
    const control = this.formulario.controls[campo];
    return control.touched && control.invalid;
  }

  protected async guardar(): Promise<void> {
    this.mensaje.set('');
    this.mensajeError.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensajeError.set('Revise los campos marcados en rojo.');
      return;
    }

    this.guardando.set(true);

    try {
      await this.comprasService.registrarCompra(this.formulario.getRawValue());
      this.mensaje.set('Compra registrada correctamente.');
      this.formulario.reset({ proveedorId: 0, insumoId: 0 });
    } catch (error) {
      this.mensajeError.set(error instanceof Error ? error.message : 'No se pudo registrar la compra.');
    } finally {
      this.guardando.set(false);
    }
  }
}