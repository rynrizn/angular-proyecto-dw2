import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../services/producto';

@Component({
  selector: 'app-producto-form',
  imports: [ReactiveFormsModule],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css',
})
export class ProductoForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private service = inject(ProductoService);

  editId = signal<number | null>(null);
  mensaje = signal('');
  submitted = signal(false);

  form = this.fb.group({
    codigo: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    categoria: ['', [Validators.required]],
    unidad: ['', [Validators.required]],
    stock: [
      0 as number,
      [Validators.required, Validators.min(0)],
    ],
    stockMinimo: [
      0 as number,
      [Validators.required, Validators.min(0)],
    ],
    precio: [
      0 as number,
      [Validators.required, Validators.min(0.01)],
    ],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      const producto = this.service.getById(id);
      if (producto) {
        this.editId.set(id);
        this.form.patchValue({
          codigo: producto.codigo,
          nombre: producto.nombre,
          categoria: producto.categoria,
          unidad: producto.unidad,
          stock: producto.stock,
          stockMinimo: producto.stockMinimo,
          precio: producto.precio,
        });
      }
    }
  }

  get f() {
    return this.form.controls;
  }

  guardar(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();
    const data = {
      codigo: raw.codigo ?? '',
      nombre: raw.nombre ?? '',
      categoria: raw.categoria ?? '',
      unidad: raw.unidad ?? '',
      stock: Number(raw.stock) ?? 0,
      stockMinimo: Number(raw.stockMinimo) ?? 0,
      precio: Number(raw.precio) ?? 0,
    };

    if (this.editId()) {
      this.service.actualizar(this.editId()!, data);
      this.mensaje.set('✔ Producto actualizado correctamente.');
    } else {
      this.service.crear(data);
      this.mensaje.set('✔ Producto creado correctamente.');
    }

    setTimeout(() => this.router.navigate(['/productos']), 1400);
  }

  cancelar(): void {
    this.router.navigate(['/productos']);
  }
}
