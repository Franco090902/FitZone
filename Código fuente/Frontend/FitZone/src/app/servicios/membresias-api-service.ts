import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Membresia {
  id_membresia: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

@Injectable({ providedIn: 'root' })
export class MembresiasApiService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getMembresias(): Observable<Membresia[]> {
    return this.http.get<Membresia[]>(`${this.api}/membresias`);
  }

  comprarMembresia(idCliente: number, idMembresia: number): Observable<any> {
    return this.http.post(`${this.api}/membresias/comprar`, { idCliente, idMembresia });
  }
}
