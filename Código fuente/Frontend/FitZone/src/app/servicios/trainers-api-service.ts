import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Trainer {
  id_trainer: number;
  nombre: string;
  especialidad: string;
  contacto: string;
  id_gimnasio: number;
}

@Injectable({ providedIn: 'root' })
export class TrainersApiService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getTrainers(): Observable<Trainer[]> {
    return this.http.get<Trainer[]>(`${this.api}/trainers`);
  }
}