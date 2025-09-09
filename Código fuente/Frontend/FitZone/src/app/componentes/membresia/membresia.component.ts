import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonIcon } from '@ionic/angular/standalone';
@Component({
  selector: 'app-membresia',
  standalone: true,
  templateUrl: './membresia.component.html',
  styleUrls: ['./membresia.component.scss'],
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonIcon]
})
export class MembresiaComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
