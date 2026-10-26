import { Routes } from '@angular/router';
import { Layout } from './core/layout/layout';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/reportes-auth/pages/login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
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
      {
        path: 'reportes',
        loadChildren: () =>
          import('./features/reportes-auth/reportes.route').then(
            (m) => m.REPORTES_ROUTE,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
