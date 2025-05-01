import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { HeaderWidget } from 'src/widgets/header';
import { RegisterStepService } from 'src/pages/register/services';
import { ButtonComponent, IconComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';

@Component({
  selector: 'complete-page',
  templateUrl: './complete.page.html',
  imports: [HeaderWidget, IconComponent, FooterWidget, ButtonComponent],
})
export class CompletePage {
  /** -------------------------------------------------------
   * PRIVATE PROPERTIES
   * -------------------------------------------------------*/

  private readonly router = inject(Router);
  private readonly registerStepService = inject(RegisterStepService);

  /** -------------------------------------------------------
   * PUBLIC PROPERTIES
   * -------------------------------------------------------*/

  readonly totalSteps = this.registerStepService.totalSteps;
  readonly currentStep = this.registerStepService.currentStep;

  goMainPage() {
    this.router.navigateByUrl('/home');
  }
}
