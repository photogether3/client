import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { HeaderWidget } from 'src/widgets/header';
import { FooterWidget } from 'src/widgets/footer';
import { ButtonComponent, IconComponent } from 'src/shared/components';
import { OtpVerifyFormComponent } from 'src/pages/otp-verify';

import { RegisterFormComponent } from '../form';

@Component({
  selector: 'register-page',
  templateUrl: './register.page.html',
  imports: [RouterLink, RegisterFormComponent, HeaderWidget, FooterWidget, ButtonComponent, OtpVerifyFormComponent, IconComponent],
})
export class RegisterPage {
  private readonly router = inject(Router);

  step = signal<number>(1);

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

  goNextStep() {
    // form.value와 form.getRawValue의 차이점 !
    // const formData = this.getRawValue();
    // this.authApi.register(formData).subscribe(() => {
    //   this.router.navigateByUrl('/otp/verify', {
    //     state: {
    //       email: formData.email,
    //     },
    //   });
    // });

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
