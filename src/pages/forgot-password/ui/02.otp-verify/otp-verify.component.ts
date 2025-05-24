import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { OtpVerifyFormComponent } from 'src/features';
import { ButtonComponent } from 'src/shared/components';
import { StepService } from 'src/shared/services';
import { FooterWidget } from 'src/widgets/footer';

@Component({
  selector: 'otp-verify-action-component',
  templateUrl: './otp-verify.component.html',
  imports: [ReactiveFormsModule, ButtonComponent, OtpVerifyFormComponent, FooterWidget],
  host: {
    class: 'flex-1 flex flex-col',
  },
})
export class OtpVerifyActionComponent {
  private readonly stepService = inject(StepService);

  otpValue = signal<string>('');

  constructor() {}

  onVerify() {
    this.stepService.setExtraData('otp', this.otpValue()).nextStep();
  }
}
