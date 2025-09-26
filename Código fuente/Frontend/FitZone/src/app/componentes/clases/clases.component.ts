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


@Component({
  selector: 'app-clases',
  standalone: true,
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.scss'],
  imports: [
    CommonModule, FormsModule, DatePipe, IonContent, IonHeader, IonSelect,
  IonSelectOption, IonAccordionGroup,IonAccordion,IonItem, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel, 
  ]
})
export class ClasesComponent  implements OnInit {
 opcion = 'grupales';
 clases:any[]=[];
 trainers: any[] = [];
 espacios: any[] = [];
reservasEspacios: { espacioId: number, fecha_hora: string }[] = [];

  constructor(private clasesServicio: ClasesServicio, private toastController: ToastController,private cdr: ChangeDetectorRef) { 
    this.clases= this.clasesServicio.getClases();
    this.trainers= this.clasesServicio.getTrainers();
    this.espacios= this.clasesServicio.getEspacios();
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
  ngOnInit() {}
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
onFechaHoraChange(event: any, espacio: any) {
  if (event.detail && event.detail.value) {
      espacio.fecha_hora = event.detail.value;
    }
}
  reservarEspacio(espacio: any) {
    console.log('Valor de fecha_hora:', espacio.fecha_hora);
    
    if (!espacio.fecha_hora) {
      this.presentToast('⚠️ Selecciona una fecha y hora para la reserva.', 'warning');
      return;
    }
    
    const horariosTomados = this.getHorariosTomados(espacio.id);
    const fechaSeleccionada = new Date(espacio.fecha_hora).toISOString();
    
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
        espacio.fecha_hora
      ).toLocaleString('es-ES')}`,
      'success'
    );
    espacio.fecha_hora = null;
    this.cdr.detectChanges();
  }

  getHorariosTomados(espacioId: number): string[] {
    return this.reservasEspacios
      .filter(r => r.espacioId === espacioId)
      .map(r => r.fecha_hora);
  }



  
}
