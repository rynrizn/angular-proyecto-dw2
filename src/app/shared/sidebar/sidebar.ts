import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-sidebar',
  styleUrl: './sidebar.css',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  menu = [
    { nombre: 'Dashboard', ruta: '/dashboard' },
    { nombre: 'Productos', ruta: '/productos' },
    { nombre: 'Inventario', ruta: '/inventario' },
    { nombre: 'Proveedores', ruta: '/proveedores' },
    { nombre: 'Compras', ruta: '/compras' },
    { nombre: 'Producción', ruta: '/produccion' },
    { nombre: 'Recetas', ruta: '/recetas' },
    { nombre: 'Reportes', ruta: '/reportes' },
  ];
}