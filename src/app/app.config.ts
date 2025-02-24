import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAngularSvgIcon } from 'angular-svg-icon';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthValidators } from 'src/entities/auth/custom-validators';
import { provideValidationService } from 'src/shared/lib/validation.service';
import { authInterceptor, errorInterceptor, loadingInterceptor } from '../shared/interceptors';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor, errorInterceptor])),
    provideAngularSvgIcon(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideValidationService(AuthValidators),
  ],
};
