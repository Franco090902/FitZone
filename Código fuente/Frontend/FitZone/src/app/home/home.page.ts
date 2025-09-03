import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ClasesComponent } from '../componentes/clases/clases.component';
import { TabsComponent } from '../componentes/tabs/tabs.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ClasesComponent, TabsComponent],
})
export class HomePage {
  constructor() {}
}
