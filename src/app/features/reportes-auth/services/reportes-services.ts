import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { API_CONFIG } from '../../../core/config/api.config';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../models/reporte.model';

@Service()
export class ReportesServices {

    private http = inject(HttpClient);
    private url = `${API_CONFIG.BASE_URL}/api/Reporte/reportes`;

    obtenerReportes(fechaInicio? : string, fechaFin? : string) : Observable<any>{

        let parametros = new HttpParams();
 
        if(fechaInicio)parametros = parametros.set('fechaInicio', fechaInicio);
        if(fechaFin) parametros = parametros.set('fechaFin', fechaFin);

        return this.http.get<ApiResponseDto>(this.url, {params: parametros});
    }
}
