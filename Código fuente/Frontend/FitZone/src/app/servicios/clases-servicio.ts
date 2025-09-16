import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClasesServicio {
  getClases() {
    return [
      {
        id: 1,
        nombre: 'Yoga Flow',
        descripcion: 'Relajación y estiramiento para todos los niveles.',
        capacidad: 20,
        fecha_hora: '2025-09-05T10:00',
        color: '#7C4DFF',
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
        color: '#212121',
        icono: 'flame-outline'
      }
    ];
  }

  getTrainers() {
    return [
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
  }

  getEspacios() {
    return [
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
  }
}
