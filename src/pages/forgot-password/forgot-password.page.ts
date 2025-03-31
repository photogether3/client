import { Component, inject, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthApi, ForgotPasswordService, GenerateOtpDTO } from 'src/entities/auth';
import { UserApi } from 'src/entities/user';
import { ButtonComponent, InputComponent, ModalService } from 'src/shared/components';
import { BaseForm } from 'src/shared/lib';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';

import { OtpVerifyFormComponent } from '../otp-verify';
import { PasswordForgotComponent } from './ui';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password.page.html',
  imports: [FooterWidget, InputComponent, ButtonComponent, HeaderWidget, ReactiveFormsModule, OtpVerifyFormComponent, PasswordForgotComponent],
})
export class ForgotPasswordPage extends BaseForm<GenerateOtpDTO> {
  // TODO otp 입력 후 확인 버튼 누르면 타이머 안 가게 수정
  private readonly authApi = inject(AuthApi);
  private readonly userApi = inject(UserApi);
  private readonly modalService = inject(ModalService);
  readonly forgotPasswordService = inject(ForgotPasswordService);

  otpVerifyForm = viewChild<OtpVerifyFormComponent>('otpVerifyForm');
  passwordForgotForm = viewChild<PasswordForgotComponent>('passwordForgotForm');
  step = signal<number>(1);
  errorMessage = signal<string>('');

  get stepTitle() {
    if (this.step() === 1) {
      return '이메일 입력';
    } else if (this.step() === 2) {
      return 'OTP 인증';
    } else {
      return '비밀번호 변경';
    }
  }

  get getButtonText() {
    if (this.step() === 1) {
      return '인증번호 전송';
    } else if (this.step() === 2) {
      return '다음으로';
    } else {
      return '비밀번호 변경';
    }
  }

  get isButtonDisabled() {
    if (this.step() === 1) {
      return !this.isValid();
    } else if (this.step() === 2) {
      return !this.otpVerifyForm()?.isVerified();
    } else {
      return !this.passwordForgotForm()!.isValid();
    }
  }

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

  clickFooterButton() {
    if (this.step() === 1) {
      this.goNextStep();
      const { email } = this.form.getRawValue();
      this.forgotPasswordService.setEmail(email as string);
    } else if (this.step() === 2) {
      return this.goNextStep();
    } else {
      return this.passwordForgotForm()!.recoverPassword();
    }
  }

  private goNextStep() {
    this.step.update((prev) => prev + 1);
  }
}
