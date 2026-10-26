import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth-service';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-sidebar',
  styleUrl: './sidebar.css',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  menu = [
    { nombre: 'Dashboard', ruta: '/dashboard' },
    { nombre: 'Productos', ruta: '/productos' },
    { nombre: 'Proveedores', ruta: '/compras/proveedores' },
    { nombre: 'Compras', ruta: '/compras/historial' },
    { nombre: 'Producción', ruta: '/produccion/ordenes' },
    { nombre: 'Recetas', ruta: '/produccion/recetas' },
    { nombre: 'Reportes', ruta: '/reportes' },
  ];

  private authService = inject(AuthService);

  logout(){

    this.authService.logout();
  }
}
