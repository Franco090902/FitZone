import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Clase {
  id_clase: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
  fecha_hora: string;
  id_gimnasio: number;
  cupos_disponibles: number;
}

@Injectable({ providedIn: 'root' })
export class ClasesApiService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getClases(idGimnasio?: number): Observable<Clase[]> {
    const url = idGimnasio ? `${this.api}/clases?gimnasio=${idGimnasio}` : `${this.api}/clases`;
    return this.http.get<Clase[]>(url);
  }
}