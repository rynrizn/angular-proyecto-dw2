import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { INSUMOS_TEMPORALES } from '../../data/insumos-temporales';
import { ComprasService } from '../../services/compras.service';

// TEMPORAL: el usuario real vendrá del AuthService del Integrante 5
const USUARIO_TEMPORAL_ID = 1;

// Fecha de hoy como "2026-10-24" (formato del campo de fecha)
function fechaDeHoy(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

// Validador propio: la fecha de la compra no puede ser posterior a hoy
function fechaNoFutura(control: AbstractControl): ValidationErrors | null {
  return control.value > fechaDeHoy() ? { futura: true } : null;
}

// Redondea a 2 decimales para evitar resultados como 0.30000000000000004
function redondear(valor: number): number {
  return Math.round(valor * 100) / 100;
}

@Component({
  selector: 'app-nueva-compra',
  imports: [ReactiveFormsModule, DecimalPipe, RouterLink],
  templateUrl: './nueva-compra.component.html',
  styleUrl: './nueva-compra.component.css'
})
export class NuevaCompraComponent {
  private fb = inject(NonNullableFormBuilder);
  private comprasService = inject(ComprasService);

  protected proveedores = this.comprasService.proveedores;
  protected insumos = INSUMOS_TEMPORALES;

  protected mensaje = signal('');
  protected mensajeError = signal('');
  protected fechaMaxima = fechaDeHoy();

  protected formulario = this.fb.group({
    proveedorId: [0, [Validators.min(1)]],
    fecha: [fechaDeHoy(), [Validators.required, fechaNoFutura]],
    lineas: this.fb.array([this.crearLinea()])
  });

  // Copia de los valores del formulario como señal, para calcular totales en vivo
  private valores = toSignal(
    this.formulario.valueChanges.pipe(map(() => this.formulario.getRawValue())),
    { initialValue: this.formulario.getRawValue() }
  );

  // Subtotal de cada fila = cantidad × precio unitario
  protected subtotales = computed(() =>
    this.valores().lineas.map(linea => redondear((linea.cantidad || 0) * (linea.precioUnitario || 0)))
  );

  // Total de la compra = suma de los subtotales
  protected total = computed(() =>
    redondear(this.subtotales().reduce((suma, subtotal) => suma + subtotal, 0))
  );

  protected get lineas() {
    return this.formulario.controls.lineas;
  }

  private crearLinea() {
    return this.fb.group({
      insumoId: [0, [Validators.min(1)]],
      cantidad: [1, [Validators.min(0.01)]],
      precioUnitario: [0, [Validators.min(0.01)]]
    });
  }

  protected agregarLinea(): void {
    this.lineas.push(this.crearLinea());
  }

  protected quitarLinea(indice: number): void {
    if (this.lineas.length > 1) {
      this.lineas.removeAt(indice);
    }
  }

  // true si el campo de la cabecera fue tocado y es inválido
  protected cabeceraInvalida(campo: 'proveedorId' | 'fecha'): boolean {
    const control = this.formulario.controls[campo];
    return control.touched && control.invalid;
  }

  // true si el campo de esa fila fue tocado y es inválido
  protected lineaInvalida(indice: number, campo: 'insumoId' | 'cantidad' | 'precioUnitario'): boolean {
    const control = this.lineas.at(indice).controls[campo];
    return control.touched && control.invalid;
  }

  protected guardar(): void {
    this.mensaje.set('');
    this.mensajeError.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensajeError.set('Revise los campos marcados en rojo.');
      return;
    }

    const datos = this.formulario.getRawValue();

    try {
      const compra = this.comprasService.registrarCompra({
        usuarioId: USUARIO_TEMPORAL_ID,
        proveedorId: datos.proveedorId,
        fecha: new Date(datos.fecha + 'T00:00:00').toISOString(),
        lineas: datos.lineas.map(linea => ({
          insumoId: linea.insumoId,
          cantidad: linea.cantidad,
          precioUnitario: linea.precioUnitario
        }))
      });

      this.mensaje.set(`Compra #${compra.id} registrada correctamente.`);
      this.limpiarFormulario();
    } catch (error) {
      this.mensajeError.set(error instanceof Error ? error.message : 'No se pudo registrar la compra.');
    }
  }

  private limpiarFormulario(): void {
    while (this.lineas.length > 1) {
      this.lineas.removeAt(1);
    }
    this.formulario.reset({ proveedorId: 0, fecha: fechaDeHoy() });
  }
}