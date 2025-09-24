import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel,IonSelect,
  IonSelectOption, IonAccordionGroup,IonAccordion,IonItem,} from '@ionic/angular/standalone';
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
    CommonModule, FormsModule, DatePipe, IonContent, IonHeader, IonSelect,
  IonSelectOption, IonAccordionGroup,IonAccordion,IonItem, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel, 
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
   if (clase.capacidad > 0){
    clase.capacidad = clase.capacidad -1;
    alert (`Reservaste la clase: ${clase.nombre}. Cupos restantes: ${clase.capacidad}`);
   } else{
    alert('No quedan cupos disponibles para esta clase');
   }
  }
  
  contactarTrainer(trainer: any) {
    if (trainer.capacidad > 0){
    trainer.capacidad = trainer.capacidad -1;
    alert (`Reservaste la clase: ${trainer.nombre}. Cupos restantes: ${trainer.capacidad}`);
   } else{
    alert('No quedan cupos disponibles para esta clase');
   }
  }

    reservarEspacio(espacio: any) {
    if (espacio.capacidad > 0){
    espacio.capacidad = espacio.capacidad -1;
    alert (`Reservaste la clase: ${espacio.nombre}. Cupos restantes: ${espacio.capacidad}`);
   } else{
    alert('No quedan cupos disponibles para esta clase');
   }
  }
}
