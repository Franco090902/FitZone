import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  if (localStorage.getItem('auth')) {
    return true;
    console.log("ya logueado");
  } else {
    window.location.href = '/login'; // Redirige si no está autenticado
    return false;
  }
};