import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, ElementRef, inject, signal, viewChildren } from '@angular/core';

import { AuthApi, PoliciesDTO } from 'src/entities/auth';
import { RegisterStepService } from 'src/pages/register/services';
import { ButtonComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';
import { PolicyDetailComponent } from './detail';

@Component({
  selector: 'policy-select-page',
  templateUrl: './policy-select.page.html',
  imports: [HeaderWidget, ButtonComponent, FooterWidget],
})
export class PolicySelectPage {
  /** -------------------------------------------------------
   * PRIVATE PROPERTIES
   * -------------------------------------------------------*/

  private readonly authApi = inject(AuthApi);
  private readonly dialog = inject(Dialog);
  private readonly registerStepService = inject(RegisterStepService);

  /** -------------------------------------------------------
   * PUBLIC PROPERTIES
   * -------------------------------------------------------*/

  checkboxList = viewChildren<ElementRef>('checkbox');
  readonly isValid = signal<boolean>(true);
  readonly policies = signal<PoliciesDTO[]>([]);
  readonly totalSteps = this.registerStepService.totalSteps;
  readonly currentStep = this.registerStepService.currentStep;
  readonly policyAgreedMockData = signal<number[]>([1, 2, 3]);

  constructor() {
    this.authApi.getPolicies().subscribe((res) => {
      this.policies.set(res);
    });
  }

  /** -------------------------------------------------------
   * PUBLIC METHODS
   * -------------------------------------------------------*/

  selectAll() {}

  onNext() {
    this.registerStepService.setExtraData('policyIds', this.policyAgreedMockData()).nextStep();
  }

  openDetail(id: number) {
    const dialogRef = this.dialog.open<string>(PolicyDetailComponent, {
      width: '100%',
      height: '100%',
      data: { id },
    });
  }
}
