import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import { GenerateOtpDTO } from 'src/entities/auth';
import { ButtonComponent, InputComponent } from 'src/shared/components';
import { BaseForm } from 'src/shared/lib';
import { StepService } from 'src/shared/services';
import { FooterWidget } from 'src/widgets/footer';

@Component({
  selector: 'email-check-page',
  templateUrl: './email-check.page.html',
  imports: [ButtonComponent, FooterWidget, InputComponent, ReactiveFormsModule],
  host: {
    class: 'flex min-h-screen flex-1 flex-col border-x bg-layer40',
  },
})
export class EmailCheckComponent extends BaseForm<GenerateOtpDTO> {
  private readonly stepService = inject(StepService);

  readonly totalSteps = this.stepService.totalSteps;
  readonly currentStep = this.stepService.currentStep;
  errorMessage = signal<string>('');

  constructor() {
    super();

    this.errorMessages = {
      email: {
        required: '이메일은 필수입니다.',
        email: '유효한 이메일 형식이 아닙니다.',
      },
    };
  }

  protected override initForm(): void {
    this.form = this.fb.group({
      email: [
        '',
        {
          validators: [Validators.required, Validators.email],
        },
      ],
    });
  }

  onNext() {
    this.stepService.setExtraData('email', this.form.getRawValue().email).nextStep();
  }
}
