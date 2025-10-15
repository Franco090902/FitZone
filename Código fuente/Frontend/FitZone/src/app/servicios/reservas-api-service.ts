import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ReservaClase {
  id_reserva: number;
  id_clase: number;
  fecha_reserva: string;
  descripcion?: string | null;
  id_cliente: number;
  clase_nombre?: string;
  clase_fecha_hora?: string;
}

// ---- Espacios ----
export interface Espacio {
  id_espacio: number;
  nombre: string;
  capacidad: number | null;
  descripcion: string | null;
  id_gimnasio: number;
}
export interface ReservaEspacio {
  id_reserva_espacio: number;
  id_espacio: number;
  id_cliente: number;
  fecha_reserva: string;
  descripcion?: string | null;
  espacio_nombre?: string;
}

// ---- Trainer ----
export interface ReservaTrainer {
  id_reserva_trainer: number;
  id_trainer: number;
  id_cliente: number;
  fecha_reserva: string;
  descripcion?: string | null;
  trainer_nombre?: string;
  especialidad?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservasApiService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Cliente
  getClienteByUsuario(idUsuario: number): Observable<{ id_cliente: number; id_gimnasio: number | null }> {
    return this.http.get<{ id_cliente: number; id_gimnasio: number | null }>(`${this.api}/clientes/by-usuario/${idUsuario}`);
  }

  // Clases
  crearReservaClase(body: { id_clase: number; fecha_reserva: string; descripcion?: string | null; id_cliente: number }): Observable<ReservaClase> {
    return this.http.post<ReservaClase>(`${this.api}/reservas`, body);
  }
  getReservasClasePorCliente(idCliente: number): Observable<ReservaClase[]> {
    return this.http.get<ReservaClase[]>(`${this.api}/clientes/${idCliente}/reservas`);
  }
  eliminarReservaClase(idReserva: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/reservas/${idReserva}`);
  }

  // Espacios
  getEspacios(idGimnasio?: number): Observable<Espacio[]> {
    const url = idGimnasio ? `${this.api}/espacios?gimnasio=${idGimnasio}` : `${this.api}/espacios`;
    return this.http.get<Espacio[]>(url);
  }
  crearReservaEspacio(body: { id_espacio: number; id_cliente: number; fecha_reserva: string; descripcion?: string | null }): Observable<ReservaEspacio> {
    return this.http.post<ReservaEspacio>(`${this.api}/espacios/reservas`, body);
  }
  getReservasEspacioPorCliente(idCliente: number): Observable<ReservaEspacio[]> {
    return this.http.get<ReservaEspacio[]>(`${this.api}/clientes/${idCliente}/espacios/reservas`);
  }
  eliminarReservaEspacio(idReservaEspacio: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/espacios/reservas/${idReservaEspacio}`);
  }

  // Trainers
  crearReservaTrainer(body: { id_trainer: number; id_cliente: number; fecha_reserva: string; descripcion?: string | null }): Observable<ReservaTrainer> {
    return this.http.post<ReservaTrainer>(`${this.api}/trainers/reservas`, body);
  }
  getReservasTrainerPorCliente(idCliente: number): Observable<ReservaTrainer[]> {
    return this.http.get<ReservaTrainer[]>(`${this.api}/clientes/${idCliente}/trainers/reservas`);
  }
  eliminarReservaTrainer(idReservaTrainer: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/trainers/reservas/${idReservaTrainer}`);
  }
}
