import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 액세스 토큰으로 요청 헤더 설정
  const accessToken = localStorage.getItem('accessToken');
  const cloneReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  return next(cloneReq);
};
