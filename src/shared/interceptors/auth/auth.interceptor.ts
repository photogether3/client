import { HttpContext, HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, EMPTY, from, lastValueFrom, Observable, switchMap } from 'rxjs';

import { AuthApi, AuthService, TokenService } from 'src/entities/auth';

const instance = TokenService.getInstance();

const skipJwtContextToken = new HttpContextToken(() => false);

const requestQueue: Array<() => void> = [];
let isRefreshing = false;

export function skipAuth(): HttpContext {
  return new HttpContext().set(skipJwtContextToken, true);
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authApi = inject(AuthApi);
  const router = inject(Router);

  if (req.context.get(skipJwtContextToken)) {
    return next(req);
  }

  if (req.url.includes('assets/icons') && req.url.endsWith('.svg')) {
    return next(req);
  }

  return from(instance.getRefreshToken()).pipe(
    switchMap(async (refreshToken) => {
      // 1. 리프레쉬가 없는 경우
      if (!refreshToken) {
        router.navigateByUrl('/login');
        return EMPTY;
      }

      // 2. 만료기한이 다 한 경우
      if (await authService.isTokenExpired()) {
        if (!isRefreshing) {
          isRefreshing = true;

          lastValueFrom(authApi.refresh(refreshToken))
            .then(async (newToken) => {
              console.log('토큰 재발급중 ..');
              await instance.store(newToken);
              requestQueue.forEach((ck) => ck());
            })
            .catch(() => {
              router.navigateByUrl('/login');
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        return new Observable((subscriber) => {
          requestQueue.push(() => {
            const accessToken = instance.getAccessToken();
            const cloneReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            next(cloneReq).subscribe(subscriber);
          });
        });
      }

      return instance.getAccessToken();
    }),

    // 3. 액세스 토큰이 있는 경우
    switchMap((accessToken) => {
      const cloneReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return next(cloneReq).pipe(
        catchError((err) => {
          if (err.error.errorCode === 401) {
            router.navigateByUrl('/login');
            return EMPTY;
          }

          throw err;
        }),
      );
    }),
  );
  // const refreshToken = instance.getRefreshToken();

  // if (!refreshToken) {
  //   alert('세션이 만료되었습니다. 다시 로그인해주세요. (리프레쉬토큰 없음)');
  //   router.navigateByUrl('/login');
  //   return EMPTY;
  // }

  // if (isTokenExpired()) {
  //   if (!isRefreshing) {
  //     isRefreshing = true;

  //     lastValueFrom(authApi.refresh(refreshToken))
  //       .then(async (newToken) => {
  //         console.log('토큰 재발급중 ..');
  //         await instance.store(newToken);
  //         requestQueue.forEach((ck) => ck());
  //       })
  //       .catch(() => {
  //         alert('세션이 만료되었습니다. 다시 로그인해주세요.');
  //         router.navigateByUrl('/login');
  //       })
  //       .finally(() => {
  //         isRefreshing = false;
  //       });
  //   }

  //   return new Observable((subscriber) => {
  //     requestQueue.push(() => {
  //       const accessToken = instance.getAccessToken();
  //       const cloneReq = req.clone({
  //         setHeaders: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       });
  //       next(cloneReq).subscribe(subscriber);
  //     });
  //   });
  // }

  // const accessToken = instance.getAccessToken();

  // const cloneReq = req.clone({
  //   setHeaders: {
  //     Authorization: `Bearer ${accessToken}`,
  //   },
  // });

  // return next(cloneReq).pipe(
  //   catchError((err) => {
  //     if (err.error.errorCode === 401) {
  //       alert('(401 ERROR) 세션이 만료되었습니다. 다시 로그인해주세요.');
  //       router.navigateByUrl('/login');
  //       return EMPTY;
  //     }

  //     throw err;
  //   }),
  // );
};
