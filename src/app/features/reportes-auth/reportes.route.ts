
import { Route } from '@angular/router';

export const REPORTES_ROUTE =[
    {
        path: '', 
        loadComponent: () => import("./pages/reportes-dashboard-component/reportes-dashboard-component").then(r => r.ReportesDashboardComponent)
    }
];