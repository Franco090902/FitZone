import { Routes } from '@angular/router';
import { TabsComponent } from './componentes/tabs/tabs.component';
import { DashboardComponent } from './componentes/dashboard/dashboard.component';
import { ClasesComponent } from './componentes/clases/clases.component';
import { EntrenamientoComponent } from './componentes/entrenamiento/entrenamiento.component';
import { CuentaComponent } from './componentes/cuenta/cuenta.component';
export const routes: Routes = [
  {
   path: '',
    component: TabsComponent,
    children: [
      { path: 'home', component: DashboardComponent },
      { path: 'clases', component: ClasesComponent },
      { path: 'entrenamiento', component: EntrenamientoComponent },
      { path: 'cuenta', component: CuentaComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
];
