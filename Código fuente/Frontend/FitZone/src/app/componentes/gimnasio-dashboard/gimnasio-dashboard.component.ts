import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-gimnasio-dashboard',
  templateUrl: './gimnasio-dashboard.component.html',
  styleUrls: ['./gimnasio-dashboard.component.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonTitle]
})
export class GimnasioDashboardComponent implements OnInit {
  constructor() { }
  ngOnInit() {}
}