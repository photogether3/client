import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthApi, GenerateOtpDTO } from 'src/entities/auth';

import { ButtonComponent, InputComponent } from 'src/shared/components';
import { BaseForm } from 'src/shared/lib';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';

import { OtpVerifyFormComponent } from '../otp-verify';

@Component({
  selector: 'app-fotgot-password-page',
  templateUrl: './forgot-password.page.html',
  imports: [FooterWidget, InputComponent, ButtonComponent, HeaderWidget, JsonPipe, ReactiveFormsModule, OtpVerifyFormComponent],
})
export class ForgotPasswordPage extends BaseForm<GenerateOtpDTO> {
  private readonly authApi = inject(AuthApi);

  step = signal<number>(2);

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

  verifyOtp() {
    this.authApi.generateOtp(this.getRawValue()).subscribe((res) => {
      console.log(res);
    });
  }
}
