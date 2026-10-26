import { Routes } from '@angular/router';
import { ComprasListComponent } from './pages/compras-list/compras-list.component';
import { NuevaCompraComponent } from './pages/nueva-compra/nueva-compra.component';
import { ProveedoresListComponent } from './pages/proveedores-list/proveedores-list.component';

export const COMPRAS_ROUTES: Routes = [
    {path: '', redirectTo: 'historial', pathMatch: 'full'},
    {path: 'historial', component: ComprasListComponent},
    {path: 'nueva', component: NuevaCompraComponent},
    {path: 'proveedores', component: ProveedoresListComponent},
];