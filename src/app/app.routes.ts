
import { Routes } from '@angular/router';
import { Layout } from './core/layout/layout';
import { Dashboard } from './features/dashboard/pages/dashboard-home/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'productos',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/inventario/pages/producto-list/producto-list').then(
                (m) => m.ProductoList,
              ),
          },
          {
            path: 'nuevo',
            loadComponent: () =>
              import('./features/inventario/pages/producto-form/producto-form').then(
                (m) => m.ProductoForm,
              ),
          },
          {
            path: ':id/editar',
            loadComponent: () =>
              import('./features/inventario/pages/producto-form/producto-form').then(
                (m) => m.ProductoForm,
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/inventario/pages/producto-detalle/producto-detalle').then(
                (m) => m.ProductoDetalle,
              ),
          },
        ],
      },
      {
        path: 'movimientos',
        loadComponent: () =>
          import('./features/inventario/pages/movimientos/movimientos').then(
            (m) => m.Movimientos,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];