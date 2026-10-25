import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { TarjetaEstadistica } from '../../models/dashboard.model';

@Component({
  imports: [NgClass],
  selector: 'app-item-tarjeta',
  styleUrl: './item-tarjeta.css',
  templateUrl: './item-tarjeta.html',
})
export class ItemTarjeta {
  tarjeta = input.required<TarjetaEstadistica>();
}