import { Routes } from '@angular/router';
import { OrdenesList } from './pages/ordenes-list/ordenes-list';
import { NuevaOrden } from './pages/nueva-orden/nueva-orden';
import { RecetasList } from './pages/recetas-list/recetas-list';
import { MermasList } from './pages/mermas-list/mermas-list';

export const PRODUCCION_ROUTES: Routes = [
  { path: '', redirectTo: 'ordenes', pathMatch: 'full' },
  { path: 'ordenes', component: OrdenesList },
  { path: 'nueva-orden', component: NuevaOrden },
  { path: 'recetas', component: RecetasList },
  { path: 'mermas', component: MermasList },
];
