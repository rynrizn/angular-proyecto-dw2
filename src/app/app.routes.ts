import { Routes } from '@angular/router';
import { Layout } from './core/layout/layout';

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
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard-home/dashboard').then(
            (m) => m.Dashboard,
          ),
      },
      {
        path: 'inventario',
        redirectTo: 'productos',
        pathMatch: 'full',
      },
      {
        path: 'productos',
        loadChildren: () =>
          import('./features/inventario/inventario.routes').then(
            (m) => m.INVENTARIO_ROUTES,
          ),
      },
      {
        path: 'movimientos',
        redirectTo: 'productos/movimientos',
        pathMatch: 'full',
      },
      {
        path: 'produccion',
        loadChildren: () =>
          import('./features/produccion/produccion.routes').then(
            (m) => m.PRODUCCION_ROUTES,
          ),
      },
      {
        path: 'recetas',
        redirectTo: 'produccion/recetas',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
