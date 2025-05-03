import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import { GenerateOtpDTO } from 'src/entities/auth';
import { RegisterStepService } from 'src/pages/register/services';
import { ButtonComponent, InputComponent } from 'src/shared/components';
import { BaseForm } from 'src/shared/lib';
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
  private readonly registerStepService = inject(RegisterStepService);

  readonly totalSteps = this.registerStepService.totalSteps;
  readonly currentStep = this.registerStepService.currentStep;
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
    this.registerStepService.setExtraData('email', this.form.getRawValue().email).nextStep();
  }
}
