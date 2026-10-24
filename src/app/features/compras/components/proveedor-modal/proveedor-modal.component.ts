import { Component, inject, input, OnInit, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateProveedorDto, Proveedor } from '../../../../models';

@Component({
  selector: 'app-proveedor-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './proveedor-modal.component.html',
  styleUrl: './proveedor-modal.component.css'
})
export class ProveedorModalComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);

  proveedor = input<Proveedor | null>(null);

  guardado = output<CreateProveedorDto>();
  cancelado = output<void>();

  formulario = this.fb.group({
    nombreEmpresa: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    contacto: ['', [Validators.required, Validators.maxLength(100)]],
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

  // true si el campo fue tocado y tiene ese error
  mostrarError(campo: string, error: string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.touched && control.hasError(error);
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.guardado.emit(this.formulario.getRawValue());
  }

  cancelar(): void {
    this.cancelado.emit();
  }
}