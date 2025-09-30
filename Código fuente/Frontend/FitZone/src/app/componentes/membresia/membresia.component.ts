import { Component, OnInit } from '@angular/core';
import {IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol} from '@ionic/angular/standalone';
@Component({
  selector: 'app-membresia',
  standalone: true,
  templateUrl: './membresia.component.html',
  styleUrls: ['./membresia.component.scss'],
  imports: [IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol]
})
export class MembresiaComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
