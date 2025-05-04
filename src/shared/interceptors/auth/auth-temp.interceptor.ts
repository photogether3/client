import { HttpContext, HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, EMPTY, lastValueFrom, Observable } from 'rxjs';

import { AuthApi, AuthService } from 'src/entities/auth';

const instance = AuthService.getInstance();

// 토큰 재발급하는 경우
// - 인증이 필요한 api의 경우만 해당됨, 인증이 필요하지 않은 경우는 해당 interceptor 건너뜀

// api 호출 시, 액세스 토큰 확인 후 다음과 같은 경우 토큰 재발급 api 요청
// 1. 액세스 토큰x, 리프레쉬 토큰o (액세스 토큰 유실)
// 2. 만료기한 종료 전 5분

// 여러 api 요청이 왔을 때 대기열에 저장했다가 순차대로 인증 필요한지 확인, 이후 api 요청

const skipJwtContextToken = new HttpContextToken(() => false);
const requestQueue: Array<() => void> = [];
let isRefreshing = false;
let retryCount = 0;
const MAX_RETRIES = 2;

export function skipAuth(): HttpContext {
  return new HttpContext().set(skipJwtContextToken, true);
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authApi = inject(AuthApi);
  const router = inject(Router);

  // 1. 인증이 필요하지 않은 요청은 interceptor 건너뜀
  if (req.context.get(skipJwtContextToken) || (req.url.includes('assets/icons') && req.url.endsWith('.svg'))) {
    return next(req);
  }

  const refreshToken = instance.getRefreshToken();
  const accessToken = instance.getAccessToken();

  if (!refreshToken) {
    alert('세션이 만료되었습니다. 다시 로그인해주세요. (리프레쉬 토큰 없음)');
    router.navigateByUrl('/login');
    return EMPTY;
  }

  // 3. 이 조건문에 걸린다는거는 5분미만 남아서 사실상 사용할 수는 있지만 이것 또한 실패될것으로 간주
  if (isTokenExpired()) {
    if (!isRefreshing) {
      isRefreshing = true;

      retryTokenRefresh(authApi, router)
        .then(() => {
          requestQueue.forEach((cb) => cb());
        })
        .finally(() => {
          isRefreshing = false;
          requestQueue.length = 0;
        });
    }

    // 무조건 일단 실패했다고 보고 API 를 대기열 큐에 일단 저장
    return new Observable((subscriber) => {
      requestQueue.push(() => {
        const token = instance.getAccessToken();
        const clone = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
        next(clone).subscribe(subscriber);
      });
    });
  }

  // 4. Access Token 유효한 경우 요청 실행
  const clone = req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } });

  return next(clone).pipe(
    catchError((err) => {
      // 서버에서 401 응답이 온 경우
      if (err.status === 401 || err.error?.errorCode === 401) {
        alert('(401 ERROR) 세션이 만료되었습니다. 다시 로그인해주세요.');
        router.navigateByUrl('/login');
        return EMPTY;
      }

      throw err;
    }),
  );
};

const isTokenExpired = (): boolean => {
  const expiresIn = instance.getExpiresIn();
  if (!expiresIn) return true;
  const remaining = expiresIn * 1000 - Date.now();
  return remaining < 5 * 60 * 1000;
};

const retryTokenRefresh = async (authApi: AuthApi, router: Router): Promise<void> => {
  const refreshToken = instance.getRefreshToken();
  if (!refreshToken) return;

  try {
    const token = await lastValueFrom(authApi.refresh(refreshToken));
    await instance.store(token);
    retryCount = 0;
  } catch (err) {
    console.error('Refresh failed:', err);
    retryCount++;

    if (retryCount < MAX_RETRIES) {
      return retryTokenRefresh(authApi, router);
    }

    alert('(리프레쉬 토큰 발급 실패) 세션이 만료되었습니다. 다시 로그인해주세요.');
    router.navigateByUrl('/login');
  }
};
