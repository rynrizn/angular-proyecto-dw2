import { Component, computed, inject, signal } from '@angular/core';
import { CreateProveedorDto, Proveedor } from '../../../../models';
import { ProveedorModalComponent } from '../../components/proveedor-modal/proveedor-modal.component';
import { ComprasService } from '../../services/compras.service';

@Component({
  selector: 'app-proveedores-list',
  imports: [ProveedorModalComponent],
  templateUrl: './proveedores-list.component.html',
  styleUrl: './proveedores-list.component.css'
})
export class ProveedoresListComponent {
  private comprasService = inject(ComprasService);

  protected terminoBusqueda = signal('');

  protected modalAbierto = signal(false);
  protected proveedorEnEdicion = signal<Proveedor | null>(null);

  protected mensaje = signal('');
  protected errorModal = signal('');

  protected proveedoresFiltrados = computed(() => {
    const termino = this.terminoBusqueda().trim().toLowerCase();
    const todos = this.comprasService.proveedores();

    if (termino === '') {
      return todos;
    }

    return todos.filter(proveedor =>
      proveedor.nombreEmpresa.toLowerCase().includes(termino) ||
      proveedor.contacto.toLowerCase().includes(termino) ||
      proveedor.telefono.includes(termino)
    );
  });

  protected buscar(texto: string): void {
    this.terminoBusqueda.set(texto);
  }

  protected abrirNuevo(): void {
    this.errorModal.set('');
    this.proveedorEnEdicion.set(null);
    this.modalAbierto.set(true);
  }

  protected abrirEditar(proveedor: Proveedor): void {
    this.errorModal.set('');
    this.proveedorEnEdicion.set(proveedor);
    this.modalAbierto.set(true);
  }

  protected cerrarModal(): void {
    this.modalAbierto.set(false);
  }

  protected guardarProveedor(datos: CreateProveedorDto): void {
    const enEdicion = this.proveedorEnEdicion();

    try {
      if (enEdicion) {
        this.comprasService.actualizarProveedor(enEdicion.id, datos);
        this.mensaje.set('Proveedor actualizado correctamente.');
      } else {
        this.comprasService.crearProveedor(datos);
        this.mensaje.set('Proveedor registrado correctamente.');
      }
      this.modalAbierto.set(false);
    } catch (error) {
      this.errorModal.set(error instanceof Error ? error.message : 'No se pudo guardar el proveedor.');
    }
  }
}