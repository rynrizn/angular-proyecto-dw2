import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto';

@Component({
  selector: 'app-producto-list',
  imports: [FormsModule, RouterLink],
  templateUrl: './producto-list.html',
  styleUrl: './producto-list.css',
})
export class ProductoList {
  private service = inject(ProductoService);

  busqueda = signal('');
  categoria = signal('');

  categorias = computed(() => [
    ...new Set(this.service.productos().map((p) => p.categoria)),
  ]);

  filtrados = computed(() => {
    const texto = this.busqueda().toLowerCase();
    return this.service.productos().filter(
      (p) =>
        (p.nombre.toLowerCase().includes(texto) ||
          p.codigo.toLowerCase().includes(texto)) &&
        (!this.categoria() || p.categoria === this.categoria()),
    );
  });

  eliminar(id: number) {
    if (confirm('¿Eliminar este producto?')) this.service.eliminar(id);
  }
}
