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
        loadChildren: () =>
          import('./features/inventario/inventario.routes').then(
            (m) => m.INVENTARIO_ROUTES,
          ),
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
        redirectTo: 'inventario/movimientos',
        pathMatch: 'full',
      },
      // Integración Día 4 (descomentar al fusionar ramas correspondientes):
      // {
      //   path: 'compras',
      //   loadChildren: () =>
      //     import('./features/compras/compras.routes').then((m) => m.COMPRAS_ROUTES),
      // },
      // {
      //   path: 'produccion',
      //   loadChildren: () =>
      //     import('./features/produccion/produccion.routes').then((m) => m.PRODUCCION_ROUTES),
      // },
      // {
      //   path: 'reportes',
      //   loadChildren: () =>
      //     import('./features/reportes-auth/reportes.routes').then((m) => m.REPORTES_ROUTES),
      // },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
