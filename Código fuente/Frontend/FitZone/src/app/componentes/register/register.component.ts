import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput } from '@ionic/angular/standalone';
@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, FormsModule]
})
export class RegisterComponent  implements OnInit {
email = '';
  password = '';
  constructor(private router: Router) {}

  register() {
    // Simulación de registro exitoso
    if (this.email && this.password) {
      localStorage.setItem('auth', 'true');
      this.router.navigateByUrl('/');
    } else {
      alert('Completa todos los campos');
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
  ngOnInit() {}

}
