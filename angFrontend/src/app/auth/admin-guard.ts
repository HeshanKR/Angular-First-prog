// file: angFrontend/src/app/auth/admin-guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.user(); // signal

  if (user && user.role === 'admin') {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
