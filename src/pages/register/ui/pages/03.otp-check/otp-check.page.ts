import { Component, inject, signal } from '@angular/core';

import { ButtonComponent } from 'src/shared/components';
import { HeaderWidget } from 'src/widgets/header';
import { OtpVerifyFormComponent } from 'src/pages/otp-verify';
import { FooterWidget } from 'src/widgets/footer';
import { StepService } from 'src/shared/services';
import { AuthApi, AuthService } from 'src/entities/auth';

@Component({
  selector: 'otp-check-page',
  templateUrl: './otp-check.page.html',
  imports: [HeaderWidget, ButtonComponent, OtpVerifyFormComponent, FooterWidget],
})
export class OtpCheckPage {
  /** -------------------------------------------------------
   * PRIVATE PROPERTIES
   * -------------------------------------------------------*/

  private readonly stepService = inject(StepService);
  private readonly authApi = inject(AuthApi);

  /** -------------------------------------------------------
   * PUBLIC PROPERTIES
   * -------------------------------------------------------*/

  readonly isValid = signal<boolean>(true);
  readonly email = signal<string>('');
  readonly otp = signal<string>('');
  readonly totalSteps = this.stepService.totalSteps;
  readonly currentStep = this.stepService.currentStep;

  constructor() {
    const email = this.stepService.getExtraData('email');
    this.email.set(email);
  }

  /** -------------------------------------------------------
   * PUBLIC METHODS
   * -------------------------------------------------------*/

  onNext() {
    const formValue = {
      email: this.email(),
      otp: this.otp(),
    };

    this.authApi.verifyOtpWithJwt(formValue).subscribe({
      next: (res) => {
        const instance = AuthService.getInstance();
        instance.store(res);
        console.log('토큰 저장 완료?', res);
        this.stepService.nextStep();
      },
    });
  }
}
