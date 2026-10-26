import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../models/reporte.model';
import { environment } from '../../../../environments/environment';

@Service()
export class ReportesServices {

    private http = inject(HttpClient);
    private url = `${environment.apiUrl}/api/Reporte/reportes`;

    obtenerReportes(fechaInicio? : string, fechaFin? : string) : Observable<any>{

        let parametros = new HttpParams();
 
        if(fechaInicio)parametros = parametros.set('fechaInicio', fechaInicio);
        if(fechaFin) parametros = parametros.set('fechaFin', fechaFin);

        return this.http.get<ApiResponseDto>(this.url, {params: parametros});
    }
}
