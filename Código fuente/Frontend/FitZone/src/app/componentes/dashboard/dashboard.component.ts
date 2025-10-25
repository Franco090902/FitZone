import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../servicios/dashboard.service';
import { AuthApi } from '../../servicios/auth-api';
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
  reservasClases: any[] = [];
  reservasTrainers: any[] = [];
  membresia: any = null;
  clasesDisponibles: any[] = [];
  reservasEspacios: any[] = [];
  clienteInfo: any = null;

  constructor(
    private dashboardService: DashboardService,
    private authApi: AuthApi
  ) {}

  ngOnInit() {
    // Obtener el ID del cliente del localStorage
    const idCliente = Number(localStorage.getItem('id_cliente'));
    if (idCliente) {
      this.cargarDatos(idCliente);
    } else {
      // Si no hay id_cliente pero hay id_usuario, intentar obtenerlo
      const idUsuario = Number(localStorage.getItem('id_usuario'));
      if (idUsuario) {
        // Necesitamos importar AuthApi y usarlo aquí
        this.authApi.getClienteByUsuario(idUsuario).subscribe({
          next: (clienteData) => {
            localStorage.setItem('id_cliente', String(clienteData.id_cliente));
            this.cargarDatos(clienteData.id_cliente);
          },
          error: (err) => {
            console.error('Error al obtener datos del cliente:', err);
          }
        });
      }
    }
  }

  cargarDatos(idCliente: number) {
    // Cargar información del cliente
    this.dashboardService.getClienteInfo(idCliente)
      .subscribe({
        next: (data) => {
          console.log('Cliente info:', data);
          this.clienteInfo = data;
        },
        error: (error) => {
          console.error('Error al cargar info del cliente:', error);
        }
      });

    // Cargar reservas de clases del cliente
    this.dashboardService.getReservasCliente(idCliente)
      .subscribe({
        next: (data) => {
          console.log('Reservas de clases:', data);
          this.reservasClases = data;
        },
        error: (error) => {
          console.error('Error al cargar reservas de clases:', error);
          this.reservasClases = [];
        }
      });

    // Cargar reservas de trainers del cliente
    this.dashboardService.getReservasTrainers(idCliente)
      .subscribe({
        next: (data) => {
          console.log('Reservas de trainers:', data);
          this.reservasTrainers = data;
        },
        error: (error) => {
          console.error('Error al cargar reservas de trainers:', error);
          this.reservasTrainers = [];
        }
      });

    // Cargar membresía
    this.dashboardService.getMembresia(idCliente)
      .subscribe({
        next: (data) => {
          console.log('Membresía:', data);
          this.membresia = data;
        },
        error: (error) => {
          console.error('Error al cargar membresía:', error);
        }
      });

    // Cargar clases disponibles
    this.dashboardService.getClasesDisponibles()
      .subscribe({
        next: (data) => {
          console.log('Clases disponibles:', data);
          this.clasesDisponibles = data;
        },
        error: (error) => {
          console.error('Error al cargar clases disponibles:', error);
          this.clasesDisponibles = [];
        }
      });

    // Cargar reservas de espacios
    this.dashboardService.getReservasEspacios(idCliente)
      .subscribe({
        next: (data) => {
          console.log('Reservas de espacios:', data);
          this.reservasEspacios = data;
        },
        error: (error) => {
          console.error('Error al cargar reservas de espacios:', error);
          this.reservasEspacios = [];
        }
      });
  }
}
