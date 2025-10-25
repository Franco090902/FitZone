import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../servicios/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    RouterLink
  ]
})
export class DashboardComponent implements OnInit {
  reservas: any[] = [];
  membresia: any = null;
  clasesDisponibles: any[] = [];
  reservasEspacios: any[] = [];
  clienteInfo: any = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    // Obtener el ID del cliente del localStorage
    const idCliente = Number(localStorage.getItem('idCliente'));
    if (idCliente) {
      this.cargarDatos(idCliente);
    }
  }

  cargarDatos(idCliente: number) {
    // Cargar información del cliente
    this.dashboardService.getClienteInfo(idCliente)
      .subscribe(data => this.clienteInfo = data);

    // Cargar reservas del cliente
    this.dashboardService.getReservasCliente(idCliente)
      .subscribe(data => this.reservas = data);

    // Cargar membresía
    this.dashboardService.getMembresia(idCliente)
      .subscribe(data => this.membresia = data);

    // Cargar clases disponibles
    this.dashboardService.getClasesDisponibles()
      .subscribe(data => this.clasesDisponibles = data);

    // Cargar reservas de espacios
    this.dashboardService.getReservasEspacios(idCliente)
      .subscribe(data => this.reservasEspacios = data);
  }
}
