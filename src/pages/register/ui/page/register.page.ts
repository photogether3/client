import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { OtpVerifyFormComponent } from 'src/pages/otp-verify';
import { ButtonComponent, IconComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';

import { RegisterFormComponent } from '../form';

@Component({
  selector: 'register-page',
  templateUrl: './register.page.html',
  imports: [RegisterFormComponent, HeaderWidget, FooterWidget, ButtonComponent, OtpVerifyFormComponent, IconComponent],
})
export class RegisterPage {
  private readonly router = inject(Router);

  step = signal<number>(1);
  isRegisterFormValid = signal(false);
  isOtpFormValid = signal(false);

  get stepTitle() {
    if (this.step() === 1) {
      return '정보입력';
    } else if (this.step() === 2) {
      return 'OTP 인증';
    } else {
      return '가입완료';
    }
  }

  get getButtonText() {
    if (this.step() === 1) {
      return '다음으로';
    } else if (this.step() === 2) {
      return '다음으로';
    } else {
      return '시작하기';
    }
  }

  get isButtonValid() {
    if (this.step() === 1) {
      return !this.isRegisterFormValid();
    } else if (this.step() === 2) {
      return !this.isOtpFormValid();
    } else {
      return false;
    }
  }

  goNextStep() {
    this.step.update((prev) => prev + 1);
  }

  clickFooterButton() {
    if (this.step() === 1) {
      return this.goNextStep();
    } else if (this.step() === 2) {
      return this.goNextStep();
    } else {
      return this.router.navigateByUrl('/home');
    }
  }
}
