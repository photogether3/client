import { Dialog } from '@angular/cdk/dialog';
import { Component, effect, ElementRef, inject, signal, viewChildren } from '@angular/core';

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

  readonly totalSteps = this.registerStepService.totalSteps;
  readonly currentStep = this.registerStepService.currentStep;

  readonly checkboxList = viewChildren<ElementRef>('checkbox');
  readonly isValid = signal<boolean>(true);
  readonly policies = signal<Partial<PoliciesDTO>[]>([]);
  readonly policyAgreedId = signal<number[]>([]);

  constructor() {
    this.authApi.getPolicies().subscribe((res) => {
      this.policies.set(res);
    });

    effect(() => {
      const requiredIds = this.policies()
        .filter((p) => p.isRequired)
        .map((p) => p.id as number);

      const agreedIds = this.policyAgreedId();
      const valid = requiredIds.every((id) => agreedIds.includes(id));
      this.isValid.set(valid);
    });
  }

  selectAll() {
    if (this.policyAgreedId().length !== 0) {
      this.policyAgreedId.set([]);
    } else {
      const allIds = this.policies().map((p) => p.id ?? 0);
      this.policyAgreedId.set(allIds);
    }
  }

  onNext() {
    this.registerStepService.setExtraData('policyIds', this.policyAgreedId()).nextStep();
  }

  openDetail(id?: number) {
    this.dialog.open<string>(PolicyDetailComponent, {
      width: '100%',
      height: '100%',
      data: { id },
    });
  }

  onTogglePolicy(id: number, event: Event) {
    const current = this.policyAgreedId();

    const updatedList = (event.target as HTMLInputElement).checked ? [...current, id] : current.filter((i) => i !== id);
    this.policyAgreedId.set(updatedList);

    console.log(this.policyAgreedId());
  }
}
