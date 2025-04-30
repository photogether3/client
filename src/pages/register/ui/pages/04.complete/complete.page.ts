import { Component, inject } from '@angular/core';

import { HeaderWidget } from 'src/widgets/header';

import { RegisterStepService } from 'src/pages/register/services';

@Component({
  selector: 'complete-page',
  templateUrl: './complete.page.html',
  imports: [HeaderWidget],
})
export class CompletePage {
  /** -------------------------------------------------------
   * PRIVATE PROPERTIES
   * -------------------------------------------------------*/

  private readonly registerStepService = inject(RegisterStepService);

  /** -------------------------------------------------------
   * PUBLIC PROPERTIES
   * -------------------------------------------------------*/

  readonly totalSteps = this.registerStepService.totalSteps;
  readonly currentStep = this.registerStepService.currentStep;
}
