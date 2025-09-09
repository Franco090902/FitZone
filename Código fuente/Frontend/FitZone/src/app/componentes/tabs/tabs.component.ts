import { Component, OnInit } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { library, playCircle, radio, search, cardOutline, } from 'ionicons/icons';
@Component({
  selector: 'app-tabs',
  standalone: true,
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [
    IonContent, IonHeader, IonIcon, IonTab, IonTabBar, IonTabButton,
    IonTabs, IonTitle, IonToolbar,
    RouterModule
  ],
})
export class TabsComponent  implements OnInit {

  constructor() {
    addIcons({ library, playCircle, radio, search, cardOutline});
   }

  ngOnInit() {}

}
