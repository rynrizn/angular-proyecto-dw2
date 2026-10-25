import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  {
    path: 'productos',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/producto-list/producto-list').then(
            (m) => m.ProductoList,
          ),
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import('./pages/producto-form/producto-form').then(
            (m) => m.ProductoForm,
          ),
      },
      {
        path: ':id/editar',
        loadComponent: () =>
          import('./pages/producto-form/producto-form').then(
            (m) => m.ProductoForm,
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/producto-detalle/producto-detalle').then(
            (m) => m.ProductoDetalle,
          ),
      },
    ],
  },
  {
    path: 'movimientos',
    loadComponent: () =>
      import('./pages/movimientos/movimientos').then((m) => m.Movimientos),
  },
  { path: '**', redirectTo: 'productos' },
];
