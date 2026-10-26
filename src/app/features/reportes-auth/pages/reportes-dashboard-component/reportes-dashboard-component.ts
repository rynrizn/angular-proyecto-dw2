import { Component, inject, OnInit, signal } from '@angular/core';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { TarjetaReporte } from '../../models/tarjeta-reporte.model';
import { TarjetaReporteComponent } from '../../components/tarjeta-reporte-component/tarjeta-reporte-component';
import { FormBuilder, FormGroup, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { ReportesServices } from '../../services/reportes-services';
import { ApiResponseDto } from '../../models/reporte.model';


Chart.register(...registerables);

@Component({
  imports: [ TarjetaReporteComponent, ɵInternalFormsSharedModule, ReactiveFormsModule],
  selector: 'app-reportes-dashboard-component',
  styleUrl: './reportes-dashboard-component.css',
  templateUrl: './reportes-dashboard-component.html',
})
export class ReportesDashboardComponent implements OnInit{


  ngOnInit(): void {
    this.generarReporte();
  }


  fb = inject(FormBuilder);
  reportesService = inject(ReportesServices);


  errorFechas = signal<string | null>(null);
  error = signal<string | null>(null);


  insumosTarjeta = signal<TarjetaReporte | null>(null);
  produccionTarjeta = signal<TarjetaReporte | null>(null);
  mermasTarjeta = signal<TarjetaReporte | null>(null);


  filtroForm : FormGroup = this.fb.nonNullable.group({
    fechaInicio: [""],
    fechaFin: [""]
  });





  generarReporte(){

    const {fechaInicio, fechaFin} = this.filtroForm.getRawValue();

    if (fechaInicio && fechaFin && fechaInicio > fechaFin) {

      this.errorFechas.set('La fecha de inicio no puede ser mayor que la fecha de fin.');
      return;

    }

    this.errorFechas.set(null);

    this.reportesService.obtenerReportes(fechaInicio, fechaFin).subscribe({
      next: (datos : ApiResponseDto) =>{
        this.mapearDatos(datos);
        this.error.set(null);
      },

      error: (error) =>{

        this.error.set("Hubo un problema con el servidor. Inténtalo más tarde.");
      }
    });;
  }










  mapearDatos(datos : ApiResponseDto){

    const labelsInsumos = datos.data.insumosSalida.map((i : any) => i.insumo);
    const valoresInsumos = datos.data.insumosSalida.map((i : any) => i.cantidadGastada);

    const datosInsumos: ChartData<'bar'> = {
    labels: labelsInsumos,
    datasets: [
      {
        label: 'Cantidad Gastada (kg)',
        data: valoresInsumos, 
        backgroundColor: '#f97316', 
        hoverBackgroundColor: '#ea580c',
        borderRadius: 8
      }
    ]
  };

  const opcionesInsumos: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#64748b'
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          color: '#64748b'
        }
      }
    }
  };


    this.insumosTarjeta.set({
      titulo: 'Insumos con Mayor Salida',
    dotColor: 'bg-orange-500',
    columnas: [
      { texto: 'Materia Prima' },
      { texto: 'Cantidad Gastada', alignRight: true }
    ],
    filas: (datos.data.insumosSalida || []).map((item : any) => {
      console.log('Item recibido:', item);
      return {
        celdas: [
          {valor: item.insumo},
          {valor: item.cantidadGastada.toFixed(2) + " kg", colorClass: 'text-slate-700 font-semibold', alignRight: true}
        ]
      }
    }),

    grafico:{

      type: 'bar',
      data: datosInsumos,
      options: opcionesInsumos,
      containerClass: 'relative h-48 w-full'
    }
    });
    

//-------------------------------------------------------------------------------------------------

  const labelsProduccion = datos.data.balanceProduccion.map((e :any) => e.estado);
  const valoresProduccion = datos.data.balanceProduccion.map((t : any) => t.total);
  const coloresProduccion = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];
  const coloresEstadosMap: { [key: string]: string } = {
  'Pendiente': 'text-blue-600 font-semibold',       
  'En Proceso': 'text-amber-600 font-semibold',     
  'Completado': 'text-emerald-600 font-semibold',   
  'Cancelado': 'text-red-600 font-semibold'         
};


  const datosProduccion: ChartData<'doughnut'> = {
    labels: labelsProduccion,
    datasets: [
      {
        data: valoresProduccion,
        backgroundColor: coloresProduccion, 
        borderWidth: 0 
      }
    ]
  };


  const opcionesProduccion: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false 
      }
    },
    cutout: '75%' 
  };

    this.produccionTarjeta.set({
      titulo: "Balance de Producción",
    dotColor: "bg-emerald-500",
    columnas: [
      { texto: 'Estado de la Orden' },
      { texto: 'Total', alignRight: true }
    ],
    filas: datos.data.balanceProduccion.map((item : any) => {

      const claseColor = coloresEstadosMap[item.estado] || 'text-slate-900 font-medium';
      return {
        celdas:[
          {valor: item.estado, colorClass: claseColor},
          {valor: item.total, alignRight: true}
        ]
      }
    }),

    grafico:{

      type: 'doughnut',
      data: datosProduccion,
      options: opcionesProduccion,
      containerClass: 'w-36 h-36'
    }
    });

//-------------------------------------------------------------------------------------------------

    this.mermasTarjeta.set({
      titulo: 'Resumen Económico de Mermas',
    dotColor: 'bg-red-500',
    columnas: [
      { texto: 'Insumo Desperdiciado' },
      { texto: 'Cantidad Perdida' },
      { texto: 'Costo Económico Total', alignRight: true }
    ],
    filas: datos.data.resumenEconomicoMermas.map((item : any) => {

      return {
        celdas:[
          {valor: item.insumo},
          {valor: item.cantidadPerdida, colorClass: 'text-slate-500'},
          {valor: item.costoTotal, colorClass: 'text-red-600 font-bold', alignRight: true}
        ]
      }
    })
    
    });

  }
}
