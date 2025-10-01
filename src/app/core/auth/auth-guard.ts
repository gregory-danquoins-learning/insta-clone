import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const AuthGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  // si déjà connecté en local → on laisse passer
  if (auth.isLoggedIn()()) {
    return true;
  }

  // sinon → vérifier auprès du backend
  return auth.checkSession().pipe(
    map((user: any) => {
      auth['_isLoggedIn'].set(true);
      auth['_username'].set(user.email);
      auth['_currentUser'].set(user);
      return true;
    }),
    catchError(() => {
      router.navigateByUrl('/login');
      return of(false);
    })
  );
};
