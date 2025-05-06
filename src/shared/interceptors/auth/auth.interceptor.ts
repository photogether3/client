import { HttpContext, HttpContextToken, HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, EMPTY, Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthApi, AuthService } from 'src/entities/auth';

const instance = AuthService.getInstance();
const skipJwtContextToken = new HttpContextToken(() => false);

const requestQueue: Array<() => void> = [];
let isRefreshing = false;

export function skipAuth(): HttpContext {
  return new HttpContext().set(skipJwtContextToken, true);
}

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const router = inject(Router);

  if (req.context.get(skipJwtContextToken) || req.url.includes('assets/icons')) {
    return next(req);
  }

  const refreshToken = instance.getRefreshToken();
  if (!refreshToken) {
    alert('세션이 만료되었습니다. 다시 로그인해주세요.');
    router.navigateByUrl('/login');
    return EMPTY;
  }

  const handleRequest = (): Observable<any> => {
    const accessToken = instance.getAccessToken();
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
    return next(authReq).pipe(
      catchError((err) => {
        if (err.status === 401) {
          if (!isRefreshing) {
            isRefreshing = true;
            return retryWithRefreshedToken(req, next);
          } else {
            return new Observable((subscriber) => {
              requestQueue.push(() => {
                const retryReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${instance.getAccessToken()}` },
                });
                next(retryReq).subscribe(subscriber);
              });
            });
          }
        }

        return new Observable((observer) => observer.error(err));
      }),
    );
  };

  if (isTokenExpired()) {
    if (!isRefreshing) {
      isRefreshing = true;
      return retryWithRefreshedToken(req, next);
    }

    return new Observable((subscriber) => {
      requestQueue.push(() => {
        handleRequest().subscribe(subscriber);
      });
    });
  }

  // 정상 토큰일 경우 바로 요청
  return handleRequest();
};

// 유효기간 5분 미만이면 만료로 간주
const isTokenExpired = (): boolean => {
  const expiresIn = instance.getExpiresIn();
  if (!expiresIn) return true;
  const timeUntilExpiry = expiresIn * 1000 - Date.now();
  return timeUntilExpiry < 10 * 60 * 1000;
};

const retryWithRefreshedToken = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authApi = inject(AuthApi);
  const router = inject(Router);

  const refreshToken = instance.getRefreshToken() as string;

  return from(authApi.refresh(refreshToken)).pipe(
    switchMap(async (newToken) => {
      await instance.store(newToken);
      isRefreshing = false;
      const newReq = req.clone({
        setHeaders: { Authorization: `Bearer ${instance.getAccessToken()}` },
      });
      return next(newReq);
    }),
    catchError(() => {
      isRefreshing = false;
      alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      router.navigateByUrl('/login');
      return EMPTY;
    }),
  );
};
