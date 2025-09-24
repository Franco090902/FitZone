import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClasesServicio {
  getClases() {
    const clases= [
      {
        nombre: 'Yoga Flow',
        descripcion: 'Relajación y estiramiento para todos los niveles.',
        capacidad: 20,
        fecha_hora: '2025-09-05T10:00',
        color: '#7C4DFF',
        icono: 'accessibility-outline'
      },
      {
        nombre: 'Spinning Power',
        descripcion: 'Entrenamiento cardiovascular intenso con música.',
        capacidad: 15,
        fecha_hora: '2025-09-05T18:00',
        color: '#00B8D4',
        icono: 'bicycle-outline'
      },
      {
        nombre: 'Funcional HIIT',
        descripcion: 'Circuito de alta intensidad para quemar calorías.',
        capacidad: 18,
        fecha_hora: '2025-09-06T09:00',
        color: '#212121',
        icono: 'flame-outline'
      }
    ];
    return clases.map((clase, idx) => ({ id: idx + 1, ...clase }));
  }

  getTrainers() {
    const trainers= [
      {
        nombre: 'Sofía Martínez',
        especialidad: 'Yoga y Pilates',
        contacto: 'sofia.martinez@fitzone.com',
        color: '#7C4DFF',
        icono: 'woman-outline'
      },
      {
        nombre: 'Lucas Gómez',
        especialidad: 'Funcional y HIIT',
        contacto: 'lucas.gomez@fitzone.com',
        color: '#00B8D4',
        icono: 'man-outline'
      },
      {
        nombre: 'Carla Ruiz',
        especialidad: 'Spinning y Cardio',
        contacto: 'carla.ruiz@fitzone.com',
        color: '#212121',
        icono: 'bicycle-outline'
      }
    ];
    return trainers.map((trainer, idx) => ({ id: idx + 1, ...trainer}));
  }

  getEspacios() {
    const espacios= [
      {
        nombre: 'SUM Principal',
        descripcion: 'Salón de usos múltiples para clases y eventos.',
        capacidad: 40,
        fecha_hora: '2025-09-07T17:00',
        color: '#7C4DFF',
        icono: 'home-outline'
      },
      {
        nombre: 'Cancha Indoor',
        descripcion: 'Cancha cubierta para fútbol y actividades grupales.',
        capacidad: 20,
        fecha_hora: '2025-09-08T19:00',
        color: '#00B8D4',
        icono: 'football-outline'
      },
      {
        nombre: 'Sala de Spinning',
        descripcion: 'Espacio equipado con bicicletas de última generación.',
        capacidad: 15,
        fecha_hora: '2025-09-09T08:00',
        color: '#212121',
        icono: 'bicycle-outline'
      }
    ];
    return espacios.map((espacio, idx) => ({ id: idx + 1, ...espacio}))
  }
}
