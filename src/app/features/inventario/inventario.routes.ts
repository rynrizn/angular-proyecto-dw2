import { Routes } from '@angular/router';

export const INVENTARIO_ROUTES: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  {
    path: 'productos',
    loadComponent: () =>
      import('./pages/producto-list/producto-list').then((m) => m.ProductoList),
  },
  {
    path: 'productos/nuevo',
    loadComponent: () =>
      import('./pages/producto-form/producto-form').then((m) => m.ProductoForm),
  },
  {
    path: 'productos/:id/editar',
    loadComponent: () =>
      import('./pages/producto-form/producto-form').then((m) => m.ProductoForm),
  },
  {
    path: 'productos/:id',
    loadComponent: () =>
      import('./pages/producto-detalle/producto-detalle').then(
        (m) => m.ProductoDetalle,
      ),
  },
  {
    path: 'movimientos',
    loadComponent: () =>
      import('./pages/movimientos/movimientos').then((m) => m.Movimientos),
  },
];
