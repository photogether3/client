import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import { catchError, map, of } from 'rxjs';

import { AuthApi, GenerateOtpDTO } from 'src/entities/auth';
import { ButtonComponent, InputComponent, ModalService } from 'src/shared/components';
import { BaseForm } from 'src/shared/lib';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';
import { PasswordUpdateComponent } from 'src/widgets/password-update';
import { UserApi } from 'src/entities/user';

import { OtpVerifyFormComponent } from '../otp-verify';

@Component({
  selector: 'app-fotgot-password-page',
  templateUrl: './forgot-password.page.html',
  imports: [FooterWidget, InputComponent, ButtonComponent, HeaderWidget, PasswordUpdateComponent, ReactiveFormsModule, OtpVerifyFormComponent],
})
export class ForgotPasswordPage extends BaseForm<GenerateOtpDTO> {
  private readonly authApi = inject(AuthApi);
  private readonly userApi = inject(UserApi);
  private readonly modalService = inject(ModalService);

  step = signal<number>(3);
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

  get isButtonValid() {
    if (this.step() === 1) {
      return !this.isValid();
    } else if (this.step() === 2) {
      // TODO 논의 필요
      return false;
    } else {
      return false;
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
      return this.goNextStep();
    } else if (this.step() === 2) {
      return this.goNextStep();
    } else {
      return this.updatePassword();
    }
  }

  private goNextStep() {
    this.step.update((prev) => prev + 1);
  }

  private updatePassword() {
    // NOTE 컴포넌트에서 페이지로 어떻게 form 상태관리?
    // const { currentPassword, password } = this.getRawValue();
    // const dto = { currentPassword, newPassword: password };
    // this.userApi
    //   .updatePassword(dto)
    //   .pipe(
    //     map(() => true),
    //     catchError(() => of(false)),
    //   )
    //   .subscribe((res) => {
    //     // TODO 비밀번호 변경 성공적으로 이루어졌을 때 나타나는 모달
    //     console.log(res, '비밀번호 재설정 성공');
    //   });
  }

  // verifyOtp() {
  //   this.authApi.generateOtp(this.getRawValue()).subscribe({
  //     next: (res) => {
  //       console.log('OTP 성공:', res);
  //     },
  //     error: (errMessage) => {
  //       this.errorMessage.set(errMessage);
  //     },
  //   });
  // }
}
