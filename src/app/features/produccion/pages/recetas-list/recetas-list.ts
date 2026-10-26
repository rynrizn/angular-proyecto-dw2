import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProduccionService } from '../../services/produccion.service';

@Component({
  selector: 'app-recetas-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './recetas-list.html',
  styleUrl: './recetas-list.css',
})
export class RecetasList {
  produccionService = inject(ProduccionService);
}
