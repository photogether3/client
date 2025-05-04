import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, throwError } from 'rxjs';

import { ErrorService } from 'src/shared/services';

// 500에러가 아니라면 에러가 난 컴포넌트에서 subscribe catchError 처리
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((err) => {
      console.log('에러 인터셉터', err.url, err.status);
      
      let message = '';
      
      // 파일 용량 초과 에러 (이미지나 포스트 업로드 시)
      if (isFileSizeError(err, req)) {
        message = '파일 크기가 너무 큽니다. 5MB 이하로 업로드 해주세요. 😢';
        console.log('asdlfkjasdlfjsadlkfjsadlkfjlksadjf');
      }
      // 서버 에러 (5xx)
      else if (err.status >= 500) {
        message = '서버 오류가 생겼습니다. 💩';
      }
      // 클라이언트 에러 (4xx)
      else if (err.status >= 400) {
        message = err.error?.message || '요청이 잘못되었습니다.';
      }
      
      if (message) {
        errorService.open(message);
      }

      return throwError(() => err);
    }),
  );
};

/**
 * 파일 사이즈 관련 에러인지 확인
 */
function isFileSizeError(err: any, req: HttpRequest<unknown>): boolean {
  // 명시적 413 에러
  if (err.status === 413) {
    return true;
  }
  
  // 대용량 파일 업로드 관련 요청에서 status가 0인 경우
  if (err.status === 0 && req.method === 'POST') {
    // 이미지 업로드 또는 포스트 생성 요청
    if (err.url?.includes('images/preview') || err.url?.includes('posts')) {
      return true;
    }
  }
  
  return false;
}