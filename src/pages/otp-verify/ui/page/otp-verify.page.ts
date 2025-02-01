import { Component, inject } from '@angular/core';
import { AuthApi } from 'src/entities/auth';
import { Router } from '@angular/router';
import { ButtonComponent } from 'src/shared/components';
import { OtpVerifyFormComponent } from '../form';

@Component({
  selector: 'otp-verify-page',
  templateUrl: './otp-verify.page.html',
  imports: [OtpVerifyFormComponent, ButtonComponent],
})
export class OtpVerifyPage {
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    const email = navigation?.extras?.state?.['email'] || null;

    this.authApi.generateOtp({ email }).subscribe();
  }
}
