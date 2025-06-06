import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { TokenService } from 'src/entities/auth';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  await tokenService.checkLoginStatus();

  if (tokenService.isLoggedIn()) {
    return true;
  }

  router.navigateByUrl('/login');
  return false;
};
