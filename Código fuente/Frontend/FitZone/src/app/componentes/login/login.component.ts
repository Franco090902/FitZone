import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonSelect,  IonSelectOption, IonHeader, IonToolbar, IonTitle, IonButton, IonInput } from '@ionic/angular/standalone';
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
  constructor(private router: Router) {}

  login() {
    if (!this.email || !this.password || !this.tipoUsuario) {
      alert("Completa todos los campos");
      return;
    }
    localStorage.setItem('auth', 'true');
    localStorage.setItem('tipoUsuario', this.tipoUsuario);
    if (this.tipoUsuario === 'gimnasio') {
      this.router.navigateByUrl('/gimnasio');
    } else {
      this.router.navigateByUrl('/');
    }

  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }
  ngOnInit() {}

}
