import { Component, inject } from '@angular/core';
import { ItemTarjeta } from '../../../../shared/components/stat-card/item-tarjeta';
import { ServicioDashboard } from '../../services/servicio-dashboard';

@Component({
  imports: [ItemTarjeta],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  dashboardService = inject(ServicioDashboard);
}