import { Injectable, inject, signal } from '@angular/core';
import { Movimiento, CreateMovimiento } from '../../../models/movimiento.model';
import { ProductoService } from './producto';


@Injectable({ providedIn: 'root' })
export class MovimientoService {
  private productoService = inject(ProductoService);

  private _movimientos = signal<Movimiento[]>([
    {
      id: 1,
      productoId: 1,
      tipo: 'entrada',
      cantidad: 20,
      fecha: '2026-10-01',
      motivo: 'Compra inicial',
    },
    {
      id: 2,
      productoId: 2,
      tipo: 'salida',
      cantidad: 3,
      fecha: '2026-10-05',
      motivo: 'Uso en producción',
    },
    {
      id: 3,
      productoId: 3,
      tipo: 'entrada',
      cantidad: 50,
      fecha: '2026-10-10',
      motivo: 'Reposición de stock',
    },
  ]);

  /** Señal de solo lectura con todos los movimientos. */
  movimientos = this._movimientos.asReadonly();

  /** Devuelve todos los movimientos (para futura transición a Observable/Promise). */
  getMovimientos(): Movimiento[] {
    return this._movimientos();
  }

  /** Filtra movimientos por producto. */
  getMovimientosByProducto(productoId: number): Movimiento[] {
    return this._movimientos().filter((m) => m.productoId === productoId);
  }

  /**
   * Registra una ENTRADA de stock.
   * Aumenta el stock del producto y agrega el movimiento al historial.
   */
  registrarEntrada(
    data: Omit<CreateMovimiento, 'tipo'>,
  ): { ok: boolean; error?: string } {
    if (data.cantidad <= 0) {
      return { ok: false, error: 'La cantidad debe ser mayor que cero.' };
    }
    const producto = this.productoService.getById(data.productoId);
    if (!producto) {
      return { ok: false, error: 'Producto no encontrado.' };
    }

    const id = this.nextId();
    const movimiento: Movimiento = { ...data, id, tipo: 'entrada' };

    this.productoService.actualizar(data.productoId, {
      stock: producto.stock + data.cantidad,
    });
    this._movimientos.update((l) => [...l, movimiento]);

    return { ok: true };
  }


  registrarSalida(
    data: Omit<CreateMovimiento, 'tipo'>,
  ): { ok: boolean; error?: string } {
    if (data.cantidad <= 0) {
      return { ok: false, error: 'La cantidad debe ser mayor que cero.' };
    }
    const producto = this.productoService.getById(data.productoId);
    if (!producto) {
      return { ok: false, error: 'Producto no encontrado.' };
    }
    if (data.cantidad > producto.stock) {
      return {
        ok: false,
        error: `Stock insuficiente. Disponible: ${producto.stock} ${producto.unidad}.`,
      };
    }

    const id = this.nextId();
    const movimiento: Movimiento = { ...data, id, tipo: 'salida' };

    this.productoService.actualizar(data.productoId, {
      stock: producto.stock - data.cantidad,
    });
    this._movimientos.update((l) => [...l, movimiento]);

    return { ok: true };
  }

  private nextId(): number {
    const ids = this._movimientos().map((m) => m.id);
    return ids.length === 0 ? 1 : Math.max(...ids) + 1;
  }
}
