import { Component, computed, inject, signal } from '@angular/core';
import { ComprasService } from '../../services/compras.service';

@Component({
  selector: 'app-proveedores-list',
  imports: [],
  templateUrl: './proveedores-list.component.html',
  styleUrl: './proveedores-list.component.css'
})
export class ProveedoresListComponent {
  private comprasService = inject(ComprasService);

  protected terminoBusqueda = signal('');

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
}