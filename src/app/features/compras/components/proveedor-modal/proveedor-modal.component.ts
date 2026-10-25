import { Component, inject, input, OnInit, output } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CreateProveedorDto, Proveedor } from '../../../../models';

function noVacio(control: AbstractControl): ValidationErrors | null {
  return String(control.value).trim() === '' ? { required: true } : null;
}

@Component({
  selector: 'app-proveedor-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './proveedor-modal.component.html',
  styleUrl: './proveedor-modal.component.css'
})
export class ProveedorModalComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);

  proveedor = input<Proveedor | null>(null);

  errorGuardado = input('');

  guardado = output<CreateProveedorDto>();
  cancelado = output<void>();

  formulario = this.fb.group({
    nombreEmpresa: ['', [noVacio, Validators.minLength(3), Validators.maxLength(150)]],
    contacto: ['', [noVacio, Validators.maxLength(100)]],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]{7,15}$')]]
  });

  ngOnInit(): void {
    const existente = this.proveedor();
    if (existente) {
      this.formulario.setValue({
        nombreEmpresa: existente.nombreEmpresa,
        contacto: existente.contacto,
        telefono: existente.telefono
      });
    }
  }

  mostrarError(campo: string, error: string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.touched && control.hasError(error);
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const valores = this.formulario.getRawValue();
    this.guardado.emit({
      nombreEmpresa: valores.nombreEmpresa.trim(),
      contacto: valores.contacto.trim(),
      telefono: valores.telefono
    });
  }

  cancelar(): void {
    this.cancelado.emit();
  }
}