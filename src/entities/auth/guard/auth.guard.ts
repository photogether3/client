import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);

  const isLoggedIn = false;
  if (!isLoggedIn) {
    alert('로그인 먼저 진행해주세요!');
    router.navigateByUrl('/login');
  }

  return isLoggedIn;
};
