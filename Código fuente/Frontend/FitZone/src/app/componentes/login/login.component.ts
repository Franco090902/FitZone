import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonSelect,  IonSelectOption, IonHeader, IonToolbar, IonTitle, IonButton, IonInput } from '@ionic/angular/standalone';
import { AuthApi } from 'src/app/servicios/auth-api';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonContent,IonSelect, IonHeader, IonSelectOption, IonToolbar, IonTitle, IonButton, IonInput, FormsModule]
})
export class LoginComponent  implements OnInit {
email = '';
  password = '';
  tipoUsuario='';
  constructor(private router: Router ,  private authApi: AuthApi) {}

  login() {
    if (!this.email || !this.password || !this.tipoUsuario) {
      alert("Completa todos los campos");
      return;
    }
   this.authApi.login({
      username: this.email, // O username si lo pides aparte
      password: this.password
    }).subscribe({
      next: (res) => {
        localStorage.setItem('auth', 'true');
        localStorage.setItem('tipoUsuario', res.tipo_usuario);
        localStorage.setItem('id_usuario', String(res.id_usuario));
        if (res.tipo_usuario === 'gimnasio') {
          this.router.navigateByUrl('/gimnasio');
        } else {
          this.router.navigateByUrl('/');
        }
      },
      error: err => {
        alert(err.error?.error || 'Usuario o contraseña incorrectos');
      }
    });
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }
  ngOnInit() {}

}
