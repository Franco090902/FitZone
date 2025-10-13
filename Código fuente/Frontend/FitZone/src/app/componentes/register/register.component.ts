import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent,IonSelect,IonSelectOption, IonHeader, IonToolbar, IonTitle, IonButton, IonInput } from '@ionic/angular/standalone';
import { AuthApi } from 'src/app/servicios/auth-api';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [IonContent,IonSelect,IonSelectOption, IonHeader, IonToolbar, IonTitle, IonButton,IonInput, FormsModule]
})
export class RegisterComponent  implements OnInit {
email = '';
  password = '';
  tipoUsuario = '';
  constructor(private router: Router, private authApi: AuthApi) {}

  register() {
    if (this.email && this.password) {
      this.authApi.register({
        username: this.email, // O puedes pedir username aparte
        password: this.password,
        tipo_usuario: this.tipoUsuario,
        email: this.email
      }).subscribe({
        next: () => {
          // Guardar auth en localStorage para el guard
          localStorage.setItem('auth', 'true');
          localStorage.setItem('tipoUsuario', this.tipoUsuario);
          if (res?.id_usuario) localStorage.setItem('id_usuario', String(res.id_usuario)); // <-- guardar
          this.router.navigateByUrl('/');
        },
        error: err => {
          alert(err.error?.error || 'Error al registrar');
        }
      });
    } else {
      alert('Completa todos los campos');
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
  ngOnInit() {}

}
