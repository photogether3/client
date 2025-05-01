import { Component, inject, signal } from '@angular/core';

import { ButtonComponent } from 'src/shared/components';
import { HeaderWidget } from 'src/widgets/header';
import { RegisterStepService } from 'src/pages/register/services';
import { FooterWidget } from 'src/widgets/footer';

@Component({
  selector: 'policy-select-page',
  templateUrl: './policy-select.page.html',
  imports: [HeaderWidget, ButtonComponent, FooterWidget],
})
export class PolicySelectPage {
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
  readonly policyAgreedMockData = signal<number[]>([1, 2, 3]);

  /** -------------------------------------------------------
   * PUBLIC METHODS
   * -------------------------------------------------------*/

  onNext() {
    this.registerStepService.setExtraData('policyIds', this.policyAgreedMockData()).nextStep();
  }
}
