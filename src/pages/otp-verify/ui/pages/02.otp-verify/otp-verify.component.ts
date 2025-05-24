import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthApi, TokenService } from 'src/entities/auth';
import { OtpVerifyFormComponent } from 'src/features';
import { ButtonComponent } from 'src/shared/components';
import { StepService } from 'src/shared/services';
import { FooterWidget } from 'src/widgets/footer';

@Component({
  selector: 'otp-verify-component',
  templateUrl: './otp-verify.component.html',
  imports: [ReactiveFormsModule, ButtonComponent, OtpVerifyFormComponent, FooterWidget],
  host: {
    class: 'flex-1 flex flex-col',
  },
})
export class OtpVerifyComponent {
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);
  private readonly stepService = inject(StepService);

  otpValue = signal<string>('');

  constructor() {}

  onVerify() {
    const email = this.stepService.getExtraData('email');

    const formValue = {
      email,
      otp: this.otpValue(),
    };

    this.authApi.verifyOtpWithJwt(formValue).subscribe({
      next: (res) => {
        const instance = TokenService.getInstance();
        instance.store(res);
        console.log('토큰 저장 완료?', res);

        this.router.navigateByUrl('/onboarding');
      },
    });
  }
}
