import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProduccionService } from '../../services/produccion.service';

@Component({
  selector: 'app-recetas-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './recetas-list.html',
  styleUrl: './recetas-list.css',
})
export class RecetasList implements OnInit {
  produccionService = inject(ProduccionService);

  // cargar recetas e insumos al montar el componente
  ngOnInit(): void {
    this.produccionService.cargarDatos();
  }
}
