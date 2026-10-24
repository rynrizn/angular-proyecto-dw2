import { Injectable, signal } from '@angular/core';
import { CreateProveedorDto, Proveedor, UpdateProveedorDto } from '../../../models';
import { CompraFactura, NuevaCompraFactura } from '../models/compra-factura.model';

// Fecha de hace N días, como texto (igual que "NOW() - INTERVAL" del seed.sql)
function haceDias(dias: number): string {
  return new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString();
}

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  // Datos iniciales tomados de sql/seed.sql
  private proveedoresSignal = signal<Proveedor[]>([
    { id: 1, nombreEmpresa: 'Distribuidora San Martin S.R.L.', contacto: 'Pedro Sanchez', telefono: '70012345' },
    { id: 2, nombreEmpresa: 'Molinos del Valle', contacto: 'Lucia Fernandez', telefono: '71098765' },
    { id: 3, nombreEmpresa: 'Química Industrial S.A.', contacto: 'Jorge Vargas', telefono: '72054321' }
  ]);

  // Cada compra del seed tenía una sola línea; aquí quedan como compras de 1 fila
  private comprasSignal = signal<CompraFactura[]>([
    { id: 1, usuarioId: 1, proveedorId: 2, fecha: haceDias(5), lineas: [{ insumoId: 1, cantidad: 300, precioUnitario: 4.5 }] },
    { id: 2, usuarioId: 1, proveedorId: 1, fecha: haceDias(4), lineas: [{ insumoId: 2, cantidad: 150, precioUnitario: 5 }] },
    { id: 3, usuarioId: 1, proveedorId: 1, fecha: haceDias(3), lineas: [{ insumoId: 4, cantidad: 50, precioUnitario: 32 }] }
  ]);

  public proveedores = this.proveedoresSignal.asReadonly();
  public compras = this.comprasSignal.asReadonly();

  // ---------- Proveedores ----------

  crearProveedor(datos: CreateProveedorDto): Proveedor {
    const nuevoId = Math.max(0, ...this.proveedoresSignal().map(p => p.id)) + 1;
    const nuevo: Proveedor = { ...datos, id: nuevoId };
    this.proveedoresSignal.update(lista => [...lista, nuevo]);
    return nuevo;
  }

  actualizarProveedor(id: number, cambios: UpdateProveedorDto): void {
    this.proveedoresSignal.update(lista =>
      lista.map(p => (p.id === id ? { ...p, ...cambios } : p))
    );
  }

  obtenerProveedor(id: number): Proveedor | undefined {
    return this.proveedoresSignal().find(p => p.id === id);
  }

  nombreProveedor(id: number): string {
    return this.obtenerProveedor(id)?.nombreEmpresa ?? 'Proveedor desconocido';
  }

  // ---------- Compras ----------

  // Pendiente (T9)
  registrarCompra(datos: NuevaCompraFactura): CompraFactura {
    const nuevoId = Math.max(0, ...this.comprasSignal().map(c => c.id)) + 1;
    const nueva: CompraFactura = { ...datos, id: nuevoId };
    this.comprasSignal.update(lista => [...lista, nueva]);
    return nueva;
  }

  totalDe(compra: CompraFactura): number {
    return compra.lineas.reduce((suma, linea) => suma + linea.cantidad * linea.precioUnitario, 0);
  }
}