import { Component, inject, signal } from '@angular/core';

import { ButtonComponent } from 'src/shared/components';
import { HeaderWidget } from 'src/widgets/header';
import { OtpVerifyFormComponent } from 'src/pages/otp-verify';
import { FooterWidget } from 'src/widgets/footer';
import { StepService } from 'src/shared/services';

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

  /** -------------------------------------------------------
   * PUBLIC PROPERTIES
   * -------------------------------------------------------*/

  readonly isValid = signal<boolean>(true);
  readonly totalSteps = this.stepService.totalSteps;
  readonly currentStep = this.stepService.currentStep;

  constructor() {
    // 확인용으로 콘솔찍음
    const email = this.stepService.getExtraData('email');
    console.log(email);
  }

  /** -------------------------------------------------------
   * PUBLIC METHODS
   * -------------------------------------------------------*/

  onNext() {
    this.stepService.nextStep();
  }
}
