import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Obtener reservas del cliente
  getReservasCliente(idCliente: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientes/${idCliente}/reservas`);
  }

  // Obtener membresía del cliente
  getMembresia(idCliente: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/membresia/${idCliente}`);
  }

  // Obtener clases disponibles
  getClasesDisponibles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/clases`);
  }

  // Obtener reservas de espacios
  getReservasEspacios(idCliente: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientes/${idCliente}/espacios/reservas`);
  }

  // Obtener información del cliente
  getClienteInfo(idCliente: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientes/${idCliente}`);
  }
}