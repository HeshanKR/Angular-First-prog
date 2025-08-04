// file: admin-guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // adjust path as needed

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.user(); // using signal

  if (user && user.role === 'admin') {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
