import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);

  const instance = AuthService.getInstance();
  const isLoggedIn = !!instance.getRefreshToken();
  // TODO 1. 액세스 토큰이 없으면 interceptor을 발동시키기
  // 2. 리프레쉬 토큰이 없으면 이동시키기 ✔️

  if (!isLoggedIn) {
    alert('로그인 먼저 진행해주세요!');
    router.navigateByUrl('/login');
  }

  // isLoggedIn- true: 페이지 이동, false: 페이지 이동 못 하게 가드
  return isLoggedIn;
};
