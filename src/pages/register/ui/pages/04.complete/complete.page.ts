import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { HeaderWidget } from 'src/widgets/header';
import { ButtonComponent, IconComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { StepService } from 'src/shared/services';

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
  private readonly stepService = inject(StepService);

  /** -------------------------------------------------------
   * PUBLIC PROPERTIES
   * -------------------------------------------------------*/

  readonly totalSteps = this.stepService.totalSteps;
  readonly currentStep = this.stepService.currentStep;

  goMainPage() {
    this.router.navigateByUrl('/home');
  }
}
