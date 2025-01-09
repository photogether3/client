import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, EMPTY, throwError } from 'rxjs';

// 500에러가 아니라면 에러가 난 컴포넌트에서 susbscribe catchError 처리 
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(res => {
      const errorMsg = res.status === 500 ? '서버 오류가 생겼습니다. 💩' : `${res.error.message}`

      if(res.status === 500){
        alert(errorMsg);
        return EMPTY;
      } else {
        return throwError(() => res);
      }
    })
  );
};