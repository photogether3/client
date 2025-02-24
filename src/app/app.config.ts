import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAngularSvgIcon } from 'angular-svg-icon';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor, errorInterceptor, loadingInterceptor } from '../shared/interceptors';
import { provideValidationService, VALIDATION_SERVICE } from 'src/shared/lib/validation.service';
import { AuthValidators } from 'src/entities/auth/custom-validators';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor, errorInterceptor])),
    provideAngularSvgIcon(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // provideValidationService(AuthValidators), // 그 다음 토큰에 매핑
    {
      provide: VALIDATION_SERVICE,
      useClass: AuthValidators,
    },
  ],
};
