import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MovimientoService } from '../../services/movimiento';
import { ProductoService } from '../../services/producto';

@Component({
  selector: 'app-producto-detalle',
  imports: [RouterLink],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.css',
})
export class ProductoDetalle {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private movimientoService = inject(MovimientoService);

  private id = Number(this.route.snapshot.paramMap.get('id'));

  producto = computed(() => this.productoService.getById(this.id));

  movimientos = computed(() =>
    this.movimientoService.getMovimientosByProducto(this.id),
  );

  stockBajo = computed(() => {
    const p = this.producto();
    return p ? p.stock <= p.stockMinimo : false;
  });

  verMovimientos(): void {
    this.router.navigate(['/movimientos']);
  }
}
