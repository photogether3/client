import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, EMPTY } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(res => {
      const errorMsg = res.status === 500 ? '서버 오류가 생겼습니다. 💩' : `${res.error.message}`

      alert(errorMsg);
      return EMPTY
    })
  );
};