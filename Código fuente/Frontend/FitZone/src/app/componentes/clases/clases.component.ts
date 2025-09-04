import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { FormsModule } from '@angular/forms';
registerLocaleData(localeEs);


@Component({
  selector: 'app-clases',
  standalone: true,
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.scss'],
  imports: [
    CommonModule, FormsModule, DatePipe, IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel
  ]
})
export class ClasesComponent  implements OnInit {
 opcion = 'grupales';
  clases = [
    {
      id: 1,
      nombre: 'Yoga Flow',
      descripcion: 'Relajación y estiramiento para todos los niveles.',
      capacidad: 20,
      fecha_hora: '2025-09-05T10:00',
      color: '#7C4DFF' ,
      icono: 'accessibility-outline'
    },
    {
      id: 2,
      nombre: 'Spinning Power',
      descripcion: 'Entrenamiento cardiovascular intenso con música.',
      capacidad: 15,
      fecha_hora: '2025-09-05T18:00',
      color: '#00B8D4',
       icono: 'bicycle-outline'
    },
    {
      id: 3,
      nombre: 'Funcional HIIT',
      descripcion: 'Circuito de alta intensidad para quemar calorías.',
      capacidad: 18,
      fecha_hora: '2025-09-06T09:00',
      color: '#212121' ,
      icono: 'flame-outline'
    }
  ];
  trainers = [
    {
      id: 1,
      nombre: 'Sofía Martínez',
      especialidad: 'Yoga y Pilates',
      contacto: 'sofia.martinez@fitzone.com',
      color: '#7C4DFF',
      icono: 'woman-outline'
    },
    {
      id: 2,
      nombre: 'Lucas Gómez',
      especialidad: 'Funcional y HIIT',
      contacto: 'lucas.gomez@fitzone.com',
      color: '#00B8D4',
      icono: 'man-outline'
    },
    {
      id: 3,
      nombre: 'Carla Ruiz',
      especialidad: 'Spinning y Cardio',
      contacto: 'carla.ruiz@fitzone.com',
      color: '#212121',
      icono: 'bicycle-outline'
    }
  ];
  espacios = [
    {
      id: 1,
      nombre: 'SUM Principal',
      descripcion: 'Salón de usos múltiples para clases y eventos.',
      capacidad: 40,
      fecha_hora: '2025-09-07T17:00',
      color: '#7C4DFF',
      icono: 'home-outline'
    },
    {
      id: 2,
      nombre: 'Cancha Indoor',
      descripcion: 'Cancha cubierta para fútbol y actividades grupales.',
      capacidad: 20,
      fecha_hora: '2025-09-08T19:00',
      color: '#00B8D4',
      icono: 'football-outline'
    },
    {
      id: 3,
      nombre: 'Sala de Spinning',
      descripcion: 'Espacio equipado con bicicletas de última generación.',
      capacidad: 15,
      fecha_hora: '2025-09-09T08:00',
      color: '#212121',
      icono: 'bicycle-outline'
    }
  ];
  constructor() { }

  ngOnInit() {}
 reservarClase(clase: any) {
    // Aquí deberás implementar la lógica de reserva con backend en el futuro
    alert(`Reservaste la clase: ${clase.nombre}`);
  }
  contactarTrainer(trainer: any) {
    alert(`Contactaste a: ${trainer.nombre}\nEmail: ${trainer.contacto}`);
  }
    reservarEspacio(espacio: any) {
    alert(`Reservaste el espacio: ${espacio.nombre}`);
  }
}
