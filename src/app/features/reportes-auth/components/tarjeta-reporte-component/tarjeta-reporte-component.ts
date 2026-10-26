import { Component, input } from '@angular/core';
import { TarjetaReporte } from '../../models/tarjeta-reporte.model';
import { NgClass } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';


@Component({
  imports: [NgClass, BaseChartDirective],
  selector: 'app-tarjeta-reporte-component',
  styleUrl: './tarjeta-reporte-component.css',
  templateUrl: './tarjeta-reporte-component.html',
})
export class TarjetaReporteComponent {

  datos = input.required<TarjetaReporte | null>();
}
