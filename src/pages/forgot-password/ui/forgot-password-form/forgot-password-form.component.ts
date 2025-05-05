import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import { ForgotPasswordDTO, UserApi } from 'src/entities/user';
import { PasswordForgotType } from 'src/entities/user/model/user.type';
import { ButtonComponent, InputComponent } from 'src/shared/components';
import { PASSWORD_REGEX } from 'src/shared/const';
import { BaseForm } from 'src/shared/lib';
import { StepService } from 'src/shared/services';
import { FooterWidget } from 'src/widgets/footer';

@Component({
  selector: 'app-forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  imports: [ReactiveFormsModule, InputComponent, FooterWidget, ButtonComponent],
  host: {
    class: 'flex min-h-screen flex-1 flex-col bg-layer40',
  },
})
export class PasswordForgotFormComponent extends BaseForm<PasswordForgotType> {
  private readonly stepService = inject(StepService);
  private readonly userApi = inject(UserApi);

  formValue = signal<ForgotPasswordDTO>({
    otp: '',
    email: '',
    password: '',
  });

  constructor() {
    super();

    this.errorMessages = {
      password: {
        required: '새 비밀번호는 필수입니다.',
        pattern: '비밀번호는 8~15자이며, 숫자, 영문자, 특수문자를 포함해야 합니다.',
      },
      confirmPassword: {
        required: '새 비밀번호 확인은 필수입니다.',
        pattern: '비밀번호는 8~15자이며, 숫자, 영문자, 특수문자를 포함해야 합니다.',
        fieldMismatch: '비밀번호가 일치하지 않습니다.',
      },
    };
  }

  protected override initForm(): void {
    this.form = this.fb.group({
      password: this.fb.control('', {
        validators: [Validators.required, Validators.pattern(PASSWORD_REGEX)],
      }),
      confirmPassword: this.fb.control('', {
        validators: [Validators.required, Validators.pattern(PASSWORD_REGEX)],
        asyncValidators: [this.validationService.validateMatchingFields('password', 'confirmPassword')],
      }),
    });
  }

  recoverPassword() {
    const email = this.stepService.getExtraData('email');
    const otp = this.stepService.getExtraData('otp');
    const password = this.form.getRawValue().password as string;

    this.formValue.set({ email, otp, password });
    this.userApi.recoverPassword(this.formValue()).subscribe((res) => {
      // TODO 비밀번호 변경 성공적으로 이루어졌을 때 나타나는 모달
      console.log(res, '비밀번호 찾기 성공');
    });
  }
}
