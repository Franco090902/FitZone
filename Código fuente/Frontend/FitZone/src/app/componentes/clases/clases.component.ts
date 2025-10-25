import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';

import { ClasesApiService, Clase } from 'src/app/servicios/clases-api-service';
import { TrainersApiService, Trainer } from 'src/app/servicios/trainers-api-service';
import {
  ReservasApiService,
  Espacio,
  ReservaEspacio,
  ReservaTrainer
} from 'src/app/servicios/reservas-api-service';
import { zonedTimeToUtc } from 'date-fns-tz';

@Component({
  selector: 'app-clases',
  standalone: true,
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.scss'],
  imports: [CommonModule, FormsModule, DatePipe, IonicModule]
})
export class ClasesComponent implements OnInit {

readonly ARG_TZ = 'America/Argentina/Buenos_Aires';

  opcion: 'grupales' | 'trainers' | 'espacios' = 'grupales';

  clases: (Clase & { icono?: string; color?: string; imagen?: string })[] = [];
  trainers: (Trainer & { icono?: string; color?: string; imagen?: string })[] = [];
  espacios: (Espacio & { icono?: string; color?: string; imagen?: string })[] = [];

  fechaHoraSeleccionadaEspacio: { [idEspacio: number]: string | null } = {};
  fechaHoraSeleccionadaTrainer: { [idTrainer: number]: string | null } = {};

  reservasEspaciosCliente: ReservaEspacio[] = [];
  reservasTrainersCliente: ReservaTrainer[] = [];

  idCliente?: number;
  idGimnasio?: number | null;

  constructor(
    private clasesApi: ClasesApiService,
    private trainersApi: TrainersApiService,
    private reservasApi: ReservasApiService,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef
  ) {}

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'bottom',
      color,
      cssClass: 'custom-toast',
      buttons: [{ text: '✖', role: 'cancel' }]
    });
    await toast.present();
  }

  ngOnInit() {
    const idUsuario = Number(localStorage.getItem('id_usuario') || 0);
    if (idUsuario) {
      this.reservasApi.getClienteByUsuario(idUsuario).subscribe({
        next: (c) => {
          this.idCliente = c.id_cliente;
          this.idGimnasio = c.id_gimnasio;
          this.cargarTodo();
        },
        error: () => this.cargarTodo()
      });
    } else {
      this.cargarTodo();
    }
  }

  private cargarTodo() {
    // Clases
    this.clasesApi.getClases(this.idGimnasio || undefined).subscribe({
      next: (data: Clase[]) => {
        this.clases = data.map((c: Clase) => ({
          ...c,
          icono: this.pickIcon(c.nombre),
          color: this.pickColor(c.nombre),
          imagen: this.pickImage(c.nombre)
        }));
      }
    });

    // Trainers
    this.trainersApi.getTrainers().subscribe({
      next: (data: Trainer[]) => {
        this.trainers = data.map((t: Trainer) => ({
          ...t,
          icono: 'person-outline',
          color: '#7C4DFF',
          imagen: this.resolveTrainerImage(t),
        }));
      }
    });

    // Espacios
    this.reservasApi.getEspacios(this.idGimnasio || undefined).subscribe({
      next: (data: Espacio[]) => {
        this.espacios = data.map((e: Espacio) => ({
          ...e,
          icono: 'home-outline',
          color: '#00B8D4',
          imagen: 'assets/imagen SUM.jpg'
        }));
        this.fechaHoraSeleccionadaEspacio = {};
        this.espacios.forEach(e => this.fechaHoraSeleccionadaEspacio[e.id_espacio] = null);
      }
    });

    // Reservas existentes del cliente
    if (this.idCliente) {
      this.reservasApi.getReservasEspacioPorCliente(this.idCliente!).subscribe(r => this.reservasEspaciosCliente = r);
      this.reservasApi.getReservasTrainerPorCliente(this.idCliente!).subscribe(r => this.reservasTrainersCliente = r);
    }
  }

  // trackBy para mejorar rendimiento y evitar warnings
  trackByEspacioId(_index: number, espacio: Espacio) {
    return espacio.id_espacio;
  }

private resolveTrainerImage(t: Trainer & { imagen?: string | null }): string {
  const val = (t.imagen ?? '').trim();

  // 1) Si la DB trae algo, respetarlo
  if (val) {
    // http(s) absoluto
    if (/^https?:\/\//i.test(val)) return val;
    // ya viene con 'assets/...'
    if (val.startsWith('assets/')) return val;
    // viene relativo 'trainers/...'
    if (val.startsWith('trainers/')) return `assets/${val}`;
    // viene sólo el nombre de archivo -> asumir carpeta trainers/
    return `assets/trainers/${val}`;
  }

  // 2) Fallback por id: coloca archivos 'src/assets/trainers/trainer-<id>.jpg'
  if (t.id_trainer) {
    return `assets/trainers/trainer-${t.id_trainer}.jpg`;
  }

  // 3) Fallback por nombre “slugificado”: 'src/assets/trainers/<slug>.jpg'
  const slug = this.slugifyNombre(t.nombre);
  return `assets/trainers/${slug}.jpg`;
}

private slugifyNombre(nombre: string): string {
  return nombre
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // saca acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')                     // espacios -> guiones
    .replace(/(^-|-$)/g, '');                        // trim guiones
}

// Imagen genérica si falla la carga
onImgError(ev: Event) {
  const img = ev.target as HTMLImageElement;
  img.onerror = null; // evitar loop si placeholder falta
  img.src = 'assets/trainers/placeholder.jpg';
}

  reservarClase(clase: Clase) {
    if (!this.idCliente) { this.presentToast('Inicia sesión para reservar', 'warning'); return; }
    if (clase.cupos_disponibles <= 0) { this.presentToast('Sin cupos', 'danger'); return; }

    this.reservasApi.crearReservaClase({
      id_clase: clase.id_clase,
      fecha_reserva: new Date().toISOString(),
      id_cliente: this.idCliente,
      descripcion: 'Reserva clase'
    }).subscribe({
      next: () => { this.presentToast('Clase reservada', 'success'); this.cargarTodo(); },
      error: e => this.presentToast(e?.error?.error || 'Error reservando', 'danger')
    });
  }

  reservarEspacio(espacio: Espacio) {
    if (!this.idCliente) { this.presentToast('Inicia sesión para reservar', 'warning'); return; }
    const sel = this.fechaHoraSeleccionadaEspacio[espacio.id_espacio];
    if (!sel) { this.presentToast('Selecciona fecha/hora', 'warning'); return; }

    const iso = this.toArgUtcIso(sel);
    if (this.reservasEspaciosCliente.some(r =>
      r.id_espacio === espacio.id_espacio &&
      new Date(r.fecha_reserva).toISOString() === iso)) {
      this.presentToast('Ya reservaste ese horario', 'danger');
      return;
    }

    this.reservasApi.crearReservaEspacio({
      id_espacio: espacio.id_espacio,
      id_cliente: this.idCliente,
      fecha_reserva: iso,
      descripcion: 'Reserva espacio'
    }).subscribe({
      next: () => {
        this.presentToast('Espacio reservado', 'success');
        this.fechaHoraSeleccionadaEspacio[espacio.id_espacio] = null;
        this.reservasApi.getReservasEspacioPorCliente(this.idCliente!).subscribe(r => this.reservasEspaciosCliente = r);
        this.cdr.detectChanges();
      },
      error: e => this.presentToast(e?.error?.error || 'Error reservando espacio', 'danger')
    });
  }

  reservarTrainer(trainer: Trainer) {
    if (!this.idCliente) { this.presentToast('Inicia sesión para reservar', 'warning'); return; }
    const sel = this.fechaHoraSeleccionadaTrainer[trainer.id_trainer];
    if (!sel) { this.presentToast('Selecciona fecha/hora', 'warning'); return; }

    const iso = this.toArgUtcIso(sel);
    if (this.reservasTrainersCliente.some(r =>
      r.id_trainer === trainer.id_trainer &&
      new Date(r.fecha_reserva).toISOString() === iso)) {
      this.presentToast('Ya reservaste ese horario con el trainer', 'danger');
      return;
    }

    this.reservasApi.crearReservaTrainer({
      id_trainer: trainer.id_trainer,
      id_cliente: this.idCliente,
      fecha_reserva: iso,
      descripcion: 'Reserva trainer'
    }).subscribe({
      next: () => {
        this.presentToast('Trainer reservado', 'success');
        this.fechaHoraSeleccionadaTrainer[trainer.id_trainer] = null;
        this.reservasApi.getReservasTrainerPorCliente(this.idCliente!).subscribe(r => this.reservasTrainersCliente = r);
        this.cdr.detectChanges();
      },
      error: e => this.presentToast(e?.error?.error || 'Error reservando trainer', 'danger')
    });
  }

  getHorariosTrainerTomados(idTrainer: number): string[] {
    return this.reservasTrainersCliente
      .filter(r => r.id_trainer === idTrainer)
      .map(r => r.fecha_reserva);
  }

  getHorariosEspacioTomados(idEspacio: number): string[] {
    return this.reservasEspaciosCliente
      .filter(r => r.id_espacio === idEspacio)
      .map(r => r.fecha_reserva);
  }

// ---- Helper TZ Argentina -> UTC ISO ----
  private toArgUtcIso(value: string): string {
    if (!value) return new Date().toISOString();
    // Si viene con Z u offset, normaliza a UTC
    if (/[zZ]|[+-]\d{2}:\d{2}$/.test(value)) {
      return new Date(value).toISOString();
    }
    // Si viene "YYYY-MM-DDTHH:mm" (sin zona), interprétalo en AR y pásalo a UTC
    return zonedTimeToUtc(value, this.ARG_TZ).toISOString();
  }

  private pickIcon(n: string) {
    n = n.toLowerCase();
    if (n.includes('yoga')) return 'accessibility-outline';
    if (n.includes('spin')) return 'bicycle-outline';
    if (n.includes('hiit') || n.includes('funcional')) return 'flame-outline';
    return 'calendar-outline';
  }
  private pickColor(n: string) {
    n = n.toLowerCase();
    if (n.includes('yoga')) return '#7C4DFF';
    if (n.includes('spin')) return '#00B8D4';
    if (n.includes('hiit') || n.includes('funcional')) return '#212121';
    return '#1976D2';
  }
  private pickImage(n: string) {
    n = n.toLowerCase();
    if (n.includes('yoga')) return 'assets/imagen Yoga Flow.jpg';
    if (n.includes('spin')) return 'assets/imagen Spinning.jpg';
    if (n.includes('hiit') || n.includes('funcional')) return 'assets/imagen Funtional Hiit.jpg';
    return 'assets/placeholder.jpg';
  }
}