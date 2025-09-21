import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { gimnasioGuard } from './auth.guard';
import { TabsComponent } from './componentes/tabs/tabs.component';
import { DashboardComponent } from './componentes/dashboard/dashboard.component';
import { ClasesComponent } from './componentes/clases/clases.component';
import { EntrenamientoComponent } from './componentes/entrenamiento/entrenamiento.component';
import { CuentaComponent } from './componentes/cuenta/cuenta.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegisterComponent } from './componentes/register/register.component';
import { MembresiaComponent } from './componentes/membresia/membresia.component';
import { GimnasioDashboardComponent } from './componentes/gimnasio-dashboard/gimnasio-dashboard.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'gimnasio', canActivate: [gimnasioGuard], component: GimnasioDashboardComponent },
  {
   path: '',
    canActivate: [authGuard],
    component: TabsComponent,
    children: [
      { path: 'home', component: DashboardComponent },
      { path: 'clases', component: ClasesComponent },
      { path: 'entrenamiento', component: EntrenamientoComponent },
      { path: 'cuenta', component: CuentaComponent },
      { path: 'membresia', component: MembresiaComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
