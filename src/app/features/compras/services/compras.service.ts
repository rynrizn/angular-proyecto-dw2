import { Injectable, signal } from '@angular/core';
import { CreateProveedorDto, Proveedor, UpdateProveedorDto } from '../../../models';
import { CompraFactura, NuevaCompraFactura } from '../models/compra-factura.model';

function haceDias(dias: number): string {
  return new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString();
}

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  private proveedoresSignal = signal<Proveedor[]>([
    { id: 1, nombreEmpresa: 'Distribuidora San Martin S.R.L.', contacto: 'Pedro Sanchez', telefono: '70012345' },
    { id: 2, nombreEmpresa: 'Molinos del Valle', contacto: 'Lucia Fernandez', telefono: '71098765' },
    { id: 3, nombreEmpresa: 'Química Industrial S.A.', contacto: 'Jorge Vargas', telefono: '72054321' }
  ]);

  private comprasSignal = signal<CompraFactura[]>([
    { id: 1, usuarioId: 1, proveedorId: 2, fecha: haceDias(5), lineas: [{ insumoId: 1, cantidad: 20, precioUnitario: 45.5 }] },
    { id: 2, usuarioId: 1, proveedorId: 1, fecha: haceDias(4), lineas: [{ insumoId: 2, cantidad: 40, precioUnitario: 8.9 }] },
    { id: 3, usuarioId: 1, proveedorId: 1, fecha: haceDias(3), lineas: [{ insumoId: 4, cantidad: 12, precioUnitario: 32 }] }
  ]);

  // Los componentes solo pueden leer; para cambiar datos usan los métodos de abajo
  public proveedores = this.proveedoresSignal.asReadonly();
  public compras = this.comprasSignal.asReadonly();

  // ---------- Proveedores ----------

  crearProveedor(datos: CreateProveedorDto): Proveedor {
    this.validarNombreUnico(datos.nombreEmpresa);
    const nuevoId = Math.max(0, ...this.proveedoresSignal().map(p => p.id)) + 1;
    const nuevo: Proveedor = { ...datos, id: nuevoId };
    this.proveedoresSignal.update(lista => [...lista, nuevo]);
    return nuevo;
  }

  actualizarProveedor(id: number, cambios: UpdateProveedorDto): void {
    if (cambios.nombreEmpresa !== undefined) {
      this.validarNombreUnico(cambios.nombreEmpresa, id);
    }
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

  // Lanza un error si ya existe otro proveedor con el mismo nombre (sin importar mayúsculas)
  private validarNombreUnico(nombre: string, idExcluido?: number): void {
    const buscado = nombre.trim().toLowerCase();
    const repetido = this.proveedoresSignal().some(
      proveedor => proveedor.id !== idExcluido && proveedor.nombreEmpresa.trim().toLowerCase() === buscado
    );
    if (repetido) {
      throw new Error('Ya existe un proveedor con ese nombre.');
    }
  }

  // ---------- Compras ----------

  // Pendiente (T9): aquí se sumará el stock con el InventarioService del Int. 2
  registrarCompra(datos: NuevaCompraFactura): CompraFactura {
    if (!this.obtenerProveedor(datos.proveedorId)) {
      throw new Error('El proveedor seleccionado no existe.');
    }
    if (datos.lineas.length === 0) {
      throw new Error('La compra debe tener al menos un insumo.');
    }
    const hayLineasInvalidas = datos.lineas.some(linea => linea.cantidad <= 0 || linea.precioUnitario <= 0);
    if (hayLineasInvalidas) {
      throw new Error('La cantidad y el precio de cada insumo deben ser mayores que cero.');
    }

    const nuevoId = Math.max(0, ...this.comprasSignal().map(c => c.id)) + 1;
    const nueva: CompraFactura = { ...datos, id: nuevoId };
    this.comprasSignal.update(lista => [...lista, nueva]);
    return nueva;
  }

  // Total de una compra = suma de (cantidad × precio unitario) de cada línea
  totalDe(compra: CompraFactura): number {
    return compra.lineas.reduce((suma, linea) => suma + linea.cantidad * linea.precioUnitario, 0);
  }
}