import { Injectable, signal } from '@angular/core';
import { Producto, CreateProducto, UpdateProducto } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private _productos = signal<Producto[]>([
    { id: 1, codigo: 'M-001', nombre: 'Tablón de cedro', categoria: 'Maderas', unidad: 'pie tablar', stock: 120, stockMinimo: 30, precio: 18 },
    { id: 2, codigo: 'M-002', nombre: 'Plancha de MDF 18mm', categoria: 'Maderas', unidad: 'plancha', stock: 6, stockMinimo: 10, precio: 210 },
    { id: 3, codigo: 'H-001', nombre: 'Bisagra de cazoleta', categoria: 'Herrajes', unidad: 'unidad', stock: 200, stockMinimo: 50, precio: 8 },
    { id: 4, codigo: 'H-002', nombre: 'Tornillo para madera 2"', categoria: 'Herrajes', unidad: 'caja', stock: 15, stockMinimo: 5, precio: 35 },
    { id: 5, codigo: 'A-001', nombre: 'Barniz marino', categoria: 'Acabados', unidad: 'galón', stock: 3, stockMinimo: 4, precio: 160 },
    { id: 6, codigo: 'A-002', nombre: 'Cola blanca', categoria: 'Acabados', unidad: 'litro', stock: 12, stockMinimo: 5, precio: 28 },
    { id: 7, codigo: 'T-001', nombre: 'Mesa de comedor', categoria: 'Terminados', unidad: 'unidad', stock: 4, stockMinimo: 1, precio: 1800 },
    { id: 8, codigo: 'T-002', nombre: 'Silla de algarrobo', categoria: 'Terminados', unidad: 'unidad', stock: 10, stockMinimo: 4, precio: 450 },
  ]);
  productos = this._productos.asReadonly();

  getById(id: number) {
    return this._productos().find(p => p.id === id);
  }

  crear(data: CreateProducto) {
    const id = Math.max(0, ...this._productos().map(p => p.id)) + 1;
    this._productos.update(l => [...l, { ...data, id }]);
  }

  actualizar(id: number, data: UpdateProducto) {
    this._productos.update(l => l.map(p => (p.id === id ? { ...p, ...data } : p)));
  }

  eliminar(id: number) {
    this._productos.update(l => l.filter(p => p.id !== id));
  }
}