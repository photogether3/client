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

  alert('로그인 먼저 진행해주세요!');
  router.navigateByUrl('/login');
  return false;
};
