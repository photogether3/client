import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, throwError } from 'rxjs';

import { ErrorService } from 'src/shared/services';

// 500에러가 아니라면 에러가 난 컴포넌트에서 subscribe catchError 처리
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((err) => {
      const status = err.status;

      let message = '';
      if (status >= 500) {
        message = '서버 오류가 생겼습니다. 💩';
      } else if (status >= 400) {
        message = err.error?.message || '요청이 잘못되었습니다.';
      }

      if (message) {
        errorService.open(message);
      }

      return throwError(() => err);
    }),
  );
};
