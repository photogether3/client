import { Component, inject } from '@angular/core';
import { VerifyOtpFormComponent } from '../form';
import { AuthApi } from 'src/entities/auth';
import { Router } from '@angular/router';
import { ButtonComponent } from 'src/shared/components';

@Component({
  selector: 'verify-otp-page',
  templateUrl: './verify-otp.page.html',
  imports: [VerifyOtpFormComponent, ButtonComponent],
})
export class VerifyOtpPage {
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    const email = navigation?.extras?.state?.['email'] || null;

    this.authApi.generateOtp({ email }).subscribe();
  }
}
