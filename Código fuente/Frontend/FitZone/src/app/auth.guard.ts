import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  if (localStorage.getItem('auth')) {
    return true;
  } else {
    window.location.href = '/login'; // Redirige si no está autenticado
    return false;
  }
};