import { HttpContext, HttpContextToken, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, lastValueFrom, Observable, tap } from 'rxjs';
import { AuthApi, AuthService } from 'src/entities/auth';

const instance = AuthService.getInstance();

// 토큰 재발급하는 경우
// - 인증이 필요한 api의 경우만 해당됨, 인증이 필요하지 않은 경우는 해당 interceptor 건너뜀

// api 호출 시, 액세스 토큰 확인 후 다음과 같은 경우 토큰 재발급 api 요청
// 1. 액세스 토큰x, 리프레쉬 토큰o (액세스 토큰 유실)
// 2. 만료기한 종료 전 5분

// 여러 api 요청이 왔을 때 대기열에 저장했다가 순차대로 인증 필요한지 확인, 이후 api 요청

const skipJwtContextToken = new HttpContextToken(() => false);

// 요청 대기열 저장소
const requestQueue: Array<() => void> = [];

export type PendingRequest = {
  req: HttpRequest<any>;
  next: HttpHandlerFn;
};

let isRefreshing = false; // 현재 토큰 갱신 중인지 확인

export function skipAuth(): HttpContext {
  return new HttpContext().set(skipJwtContextToken, true);
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // TODO FSD 요청에 맞추어 수정
  const authApi = inject(AuthApi);
  const router = inject(Router);

  // 1. 인증이 필요하지 않은 요청은 interceptor 건너뜀
  if (req.context.get(skipJwtContextToken)) {
    return next(req);
  }

  if (req.url.includes('assets/icons') && req.url.endsWith('.svg')) {
    return next(req);
  }

  // 2. refresh token 확인
  const refreshToken = instance.getRefreshToken();

  if (!refreshToken) {
    alert('세션이 만료되었습니다. 다시 로그인해주세요.');
    router.navigateByUrl('/login');
    return EMPTY;
  }

  // 3. 이 조건문에 걸린다는거는 5분미만 남아서 사실상 사용할 수는 있지만 이것 또한 실패될것으로 간주
  if (isTokenExpired()) {
    console.log('만료됨');

    // TODO (질문) 궁금한 부분 왜 observer?
    if (!isRefreshing) {
      isRefreshing = true;

      lastValueFrom(authApi.refresh(refreshToken))
        .then((newToken) => {
          console.log('토큰 재발급중 ..');
          instance.store(newToken);

          requestQueue.forEach((ck) => ck());
        })
        .catch((err) => {
          console.log(err);
          // 갱신 실패 시 로그인 페이지로 이동
          alert('세션이 만료되었습니다. 다시 로그인해주세요.');
          router.navigateByUrl('/login');
        })
        .finally(() => {
          isRefreshing = false;
          console.log(requestQueue);
        });
    }

    // 무조건 일단 실패했다고 보고 API 를 대기열 큐에 일단 저장
    return new Observable((subscriber) => {
      requestQueue.push(() => {
        const accessToken = instance.getAccessToken();
        const cloneReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        next(cloneReq).subscribe(subscriber); // 재요청 실행
      });
    }).pipe(tap(console.log));
  }

  // 4. Access Token 유효한 경우 요청 실행
  const accessToken = instance.getAccessToken();

  const cloneReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return next(cloneReq);

  // TODO 서버에서 커스텀 에러 줄 때에 대한 처리 필요
};

// 토큰 만료 확인 함수
const isTokenExpired = (): boolean => {
  const expiresIn = instance.getExpiresIn();

  if (!expiresIn) {
    return true;
  } else {
    const timeUntilExpiry = expiresIn * 1000 - Date.now();
    return timeUntilExpiry < 5 * 60 * 1000;
  }
};
