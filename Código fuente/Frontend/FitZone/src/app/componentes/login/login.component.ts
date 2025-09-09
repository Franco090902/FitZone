import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput } from '@ionic/angular/standalone';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, FormsModule]
})
export class LoginComponent  implements OnInit {
email = '';
  password = '';
  constructor(private router: Router) {}

  login() {
    // Simulación de login exitoso
    if (this.email && this.password) {
      localStorage.setItem('auth', 'true');
      this.router.navigateByUrl('/');
    } else {
      alert('Completa todos los campos');
    }
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }
  ngOnInit() {}

}
