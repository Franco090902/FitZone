import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { FormsModule } from '@angular/forms';
import { ClasesServicio } from 'src/app/servicios/clases-servicio';
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
 clases:any[]=[];
 trainers: any[] = [];
 espacios: any[] = [];


  constructor(private clasesServicio: ClasesServicio) { 
    this.clases= this.clasesServicio.getClases();
    this.trainers= this.clasesServicio.getTrainers();
    this.espacios= this.clasesServicio.getEspacios();
  }

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
