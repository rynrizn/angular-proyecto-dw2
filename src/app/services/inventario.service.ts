import { Injectable, signal, computed } from '@angular/core';
import { Insumo, CreateInsumoDto, UpdateInsumoDto } from '../models';
import { Producto, CreateProducto, UpdateProducto } from '../models';

@Injectable({ providedIn: 'root' })
export class InventarioService {

  // --- Señales privadas para insumos de carpintería ---
  private _insumos = signal<Insumo[]>([
    { id: 1, nombre: 'Madera de Pino', unidadMedida: 'm³', stockActual: 25, stockMinimo: 10, costoPromedio: 45.50 },
    { id: 2, nombre: 'Tornillos para Madera 3"', unidadMedida: 'caja', stockActual: 50, stockMinimo: 20, costoPromedio: 8.90 },
    { id: 3, nombre: 'Clavos de Acero', unidadMedida: 'kg', stockActual: 100, stockMinimo: 30, costoPromedio: 5.20 },
    { id: 4, nombre: 'Laca para Madera', unidadMedida: 'L', stockActual: 15, stockMinimo: 5, costoPromedio: 32.00 },
    { id: 5, nombre: 'Barniz Al Agua', unidadMedida: 'L', stockActual: 8, stockMinimo: 3, costoPromedio: 45.00 },
    { id: 6, nombre: 'Lija P120', unidadMedida: 'hojas', stockActual: 200, stockMinimo: 50, costoPromedio: 1.80 },
  ]);

  // --- Señales privadas para productos de carpintería ---
  private _productos = signal<Producto[]>([
    { id: 1, codigo: 'C-001', nombre: 'Silla de Comedor', categoria: 'Muebles', unidad: 'unidad', stock: 12, stockMinimo: 5, precio: 120.00, descripcion: 'Silla de madera de pino' },
    { id: 2, codigo: 'C-002', nombre: 'Mesa de Centro', categoria: 'Muebles', unidad: 'unidad', stock: 5, stockMinimo: 2, precio: 350.00, descripcion: 'Mesa de pino 1.2m' },
    { id: 3, codigo: 'C-003', nombre: 'Estante de pared', categoria: 'Alfabetización', unidad: 'unidad', stock: 15, stockMinimo: 8, precio: 89.00, descripcion: 'Estante de pino 0.8m' },
    { id: 4, codigo: 'C-004', nombre: 'Armario 2Puertas', categoria: 'Muebles', unidad: 'unidad', stock: 3, stockMinimo: 1, precio: 650.00, descripcion: 'Armario de pino con 2 puertas' },
  ]);

  // --- Señales públicas de solo lectura ---
  readonly insumos = this._insumos.asReadonly();
  readonly productos = this._productos.asReadonly();

  // --- Señal computada: insumos críticos (stockActual <= stockMinimo) ---
  readonly insumosCriticos = computed(() => this._insumos().filter(i => i.stockActual <= i.stockMinimo));

  // --- Métodos para insumos ---

  listarInsumos(): Insumo[] {
    return this._insumos();
  }

  obtenerInsumo(id: number): Insumo | undefined {
    return this._insumos().find(i => i.id === id);
  }

  crearInsumo(dto: CreateInsumoDto): Insumo {
    const id = Math.max(0, ...this._insumos().map(i => i.id)) + 1;
    const nuevo: Insumo = { ...dto, id };
    this._insumos.update(l => [...l, nuevo]);
    return nuevo;
  }

  actualizarInsumo(id: number, dto: UpdateInsumoDto): Insumo | undefined {
    const index = this._insumos().findIndex(i => i.id === id);
    if (index === -1) return undefined;
    const actualizado = { ...this._insumos()[index], ...dto } as Insumo;
    this._insumos.update(l => l.splice(index, 1, actualizado));
    return actualizado;
  }

  eliminarInsumo(id: number): boolean {
    const antes = this._insumos().length;
    this._insumos.update(l => l.filter(i => i.id !== id));
    return this._insumos().length < antes;
  }

  // --- Métodos para productos de carpintería ---

  listarProductos(): Producto[] {
    return this._productos();
  }

  obtenerProducto(id: number): Producto | undefined {
    return this._productos().find(p => p.id === id);
  }

  crearProducto(dto: CreateProducto): Producto {
    const id = Math.max(0, ...this._productos().map(p => p.id)) + 1;
    const nuevo: Producto = { ...dto, id };
    this._productos.update(l => [...l, nuevo]);
    return nuevo;
  }

  actualizarProducto(id: number, dto: UpdateProducto): Producto | undefined {
    const index = this._productos().findIndex(p => p.id === id);
    if (index === -1) return undefined;
    const actualizado = { ...this._productos()[index], ...dto } as Producto;
    this._productos.update(l => l.splice(index, 1, actualizado));
    return actualizado;
  }

  eliminarProducto(id: number): boolean {
    const antes = this._productos().length;
    this._productos.update(l => l.filter(p => p.id !== id));
    return this._productos().length < antes;
  }

  // --- Método para actualizar stock con validación de negativo ---
  actualizarStock(id: number, cantidad: number): { ok: boolean; error?: string; nuevoStock?: number } {
    // Buscar en insumos
    let insumo = this._insumos().find(i => i.id === id);
    if (insumo) {
      const nuevo = insumo.stockActual + cantidad;
      if (nuevo < 0) return { ok: false, error: 'No se puede dejar el stock negativo.' };
      this._insumos.update(l => l.map(i => i.id === id ? { ...i, stockActual: nuevo } : i));
      return { ok: true, nuevoStock: nuevo };
    }

    // Buscar en productos
    let producto = this._productos().find(p => p.id === id);
    if (producto) {
      const nuevo = producto.stock + cantidad;
      if (nuevo < 0) return { ok: false, error: 'No se puede dejar el stock negativo.' };
      this._productos.update(l => l.map(p => p.id === id ? { ...p, stock: nuevo } : p));
      return { ok: true, nuevoStock: nuevo };
    }

    return { ok: false, error: 'Insumo o producto no encontrado.' };
  }
}