import { Component, inject, signal } from '@angular/core';

import { ButtonComponent } from 'src/shared/components';
import { HeaderWidget } from 'src/widgets/header';

import { RegisterStepService } from 'src/pages/register/services';

@Component({
  selector: 'otp-check-page',
  templateUrl: './otp-check.page.html',
  imports: [HeaderWidget, ButtonComponent],
})
export class OtpCheckPage {
  /** -------------------------------------------------------
   * PRIVATE PROPERTIES
   * -------------------------------------------------------*/

  private readonly registerStepService = inject(RegisterStepService);

  /** -------------------------------------------------------
   * PUBLIC PROPERTIES
   * -------------------------------------------------------*/

  readonly isValid = signal<boolean>(true);
  readonly totalSteps = this.registerStepService.totalSteps;
  readonly currentStep = this.registerStepService.currentStep;

  constructor() {
    // 확인용으로 콘솔찍음
    const email = this.registerStepService.getExtraData('email');
    console.log(email);
  }

  /** -------------------------------------------------------
   * PUBLIC METHODS
   * -------------------------------------------------------*/

  onNext() {
    this.registerStepService.nextStep();
  }
}
