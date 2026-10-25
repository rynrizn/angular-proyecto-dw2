
import { Routes } from '@angular/router';
import { Layout } from './shared/layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';

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
          import('./pages/movimientos/movimientos').then(
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