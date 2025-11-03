import { Component, OnInit } from '@angular/core';
import { MembresiasApiService, Membresia } from 'src/app/servicios/membresias-api-service';
import { IonButton, IonAccordion, IonAccordionGroup, IonContent, IonItem, IonLabel, IonIcon, IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-membresia',
  standalone: true,
  templateUrl: './membresia.component.html',
  styleUrls: ['./membresia.component.scss'],
  imports: [IonButton, IonAccordion, IonAccordionGroup, IonContent, IonItem, IonLabel, IonIcon, IonHeader, IonToolbar, IonTitle]
})
export class MembresiaComponent implements OnInit {
  membresias: Membresia[] = [];

  constructor(private membresiasApi: MembresiasApiService) {}

  ngOnInit() {
    this.membresiasApi.getMembresias().subscribe({
      next: (data) => this.membresias = data,
      error: (err) => console.error('Error cargando membresías:', err)
    });
  }

  comprar(idMembresia: number) {
    const idCliente = 1; // esto se reemplazará con el ID real del usuario logueado
    this.membresiasApi.comprarMembresia(idCliente, idMembresia).subscribe({
      next: () => alert('¡Membresía adquirida!'),
      error: (err) => console.error('Error en compra:', err)
    });
  }
}
