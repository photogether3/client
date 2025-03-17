import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthApi } from 'src/entities/auth';

import { OtpVerifyFormComponent } from '../form';

@Component({
  selector: 'otp-verify-page',
  templateUrl: './otp-verify.page.html',
  imports: [OtpVerifyFormComponent],
})
export class OtpVerifyPage {
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);

  otpSent = signal<boolean>(false);

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    const email = navigation?.extras?.state?.['email'] || null;

    this.authApi.generateOtp({ email }).subscribe({
      next: () => {
        this.otpSent.set(true);
      },
      error: (err) => {
        console.error('otp 요청 실패', err);
        this.otpSent.set(false);
      },
    });
  }
}
