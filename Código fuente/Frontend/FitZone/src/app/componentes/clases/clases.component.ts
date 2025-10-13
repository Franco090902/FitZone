import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel,IonSelect,
  IonSelectOption, IonAccordionGroup,IonAccordion,IonItem,} from '@ionic/angular/standalone';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { FormsModule } from '@angular/forms';
import { ClasesServicio } from 'src/app/servicios/clases-servicio';
registerLocaleData(localeEs);
import { ChangeDetectorRef } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { TrainersApiService } from 'src/app/servicios/trainers-api-service';
import { ReservasApiService } from 'src/app/servicios/reservas-api-service';

@Component({
  selector: 'app-clases',
  standalone: true,
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.scss'],
  imports: [
    CommonModule, FormsModule, DatePipe, IonicModule 
  ]
})
export class ClasesComponent  implements OnInit {
 opcion = 'grupales';
 clases:any[]=[];
 trainers: any[] = [];
 espacios: any[] = [];
reservasEspacios: { espacioId: number, fecha_hora: string }[] = [];
fechaHoraSeleccionada: { [espacioId: number]: string | null } = {};
  constructor(private clasesServicio: ClasesServicio, private toastController: ToastController,private cdr: ChangeDetectorRef) { 
    
  }


  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'bottom',
      color,
      cssClass: 'custom-toast',
      buttons: [
        {
          text: '✖',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }
  ngOnInit() {

    this.clases= this.clasesServicio.getClases();
    this.trainers= this.clasesServicio.getTrainers();
    this.espacios= this.clasesServicio.getEspacios();
    this.espacios.forEach(espacio => {
    this.fechaHoraSeleccionada[espacio.id] = null;
});
  }
 reservarClase(clase: any) {
    // Aquí deberás implementar la lógica de reserva con backend en el futuro
   if (clase.capacidad > 0){
    clase.capacidad = clase.capacidad -1;
    this.presentToast(
        `✅ Reservaste la clase: ${clase.nombre}. Cupos restantes: ${clase.capacidad}`,
        'success'
      );
   } else{
    this.presentToast('⚠️ No quedan cupos disponibles para esta clase', 'danger');
   }
  }
  
  contactarTrainer(trainer: any) {
    this.presentToast(`✅ Reservaste la clase:  ${trainer.nombre}`);
  }
onFechaHoraChange(event: any, espacioId: number) {
    if (event.detail && event.detail.value) {
      this.fechaHoraSeleccionada[espacioId] = event.detail.value;
    } else {
      this.fechaHoraSeleccionada[espacioId] = null;
    }
  } 

trackByEspacioId(index: number, espacio: any): number {
    return espacio.id;
  }

  reservarEspacio(espacio: any) {
     const fecha_hora_seleccionada = this.fechaHoraSeleccionada[espacio.id];
    console.log('Valor de fecha_hora:', fecha_hora_seleccionada);
    
    if (!fecha_hora_seleccionada) {
      this.presentToast('⚠️ Selecciona una fecha y hora para la reserva.', 'warning');
      return;
    }
    
    const horariosTomados = this.getHorariosTomados(espacio.id);
    const fechaSeleccionada = new Date(fecha_hora_seleccionada).toISOString();
    
    if (horariosTomados.some(h => new Date(h).toISOString() === fechaSeleccionada)) {
         this.presentToast('⚠️ Ese horario ya está reservado. Elige otro.', 'danger');
      return;
    }
    
    this.reservasEspacios.push({ 
      espacioId: espacio.id, 
      fecha_hora: fechaSeleccionada 
    });
    
    this.presentToast(
      `✅ Reservaste el espacio: ${espacio.nombre} para el ${new Date(
        fecha_hora_seleccionada
      ).toLocaleString('es-ES')}`,
      'success'
    );
    this.fechaHoraSeleccionada[espacio.id] = null;
    this.cdr.detectChanges();
  }

  getHorariosTomados(espacioId: number): string[] {
    return this.reservasEspacios
      .filter(r => r.espacioId === espacioId)
      .map(r => r.fecha_hora);
  }



  
}
