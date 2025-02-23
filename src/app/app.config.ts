import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAngularSvgIcon } from 'angular-svg-icon';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthValidators } from 'src/entities/auth';
import { AUTH_VALIDATORS, provideAuthValidator } from 'src/shared/lib';
import { authInterceptor, errorInterceptor, loadingInterceptor } from '../shared/interceptors';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor, errorInterceptor])),
    provideAngularSvgIcon(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    /**
     * @desc
     * AUTH_VALIDATORS 토큰에 실제 구현체를 주입해줍니다.
     */
    {
      provide: AUTH_VALIDATORS,
      useClass: AuthValidators,
    },
    /**
     * @info
     * 프로바이더를 등록하는 부분을 타 앵귤러의 기능처럼 함수화 하고싶다면
     * 아래와 같이 등록할 수 있습니다.
     */
    // provideAuthValidator(AuthValidators),
  ],
};
