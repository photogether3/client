import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { ForgotPasswordService } from 'src/entities/auth';

import { UserApi } from 'src/entities/user';
import { PasswordForgotType } from 'src/entities/user/model/user.type';
import { InputComponent } from 'src/shared/components';
import { PASSWORD_REGEX } from 'src/shared/const';
import { BaseForm } from 'src/shared/lib';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  imports: [ReactiveFormsModule, InputComponent],
})
export class PasswordForgotComponent extends BaseForm<PasswordForgotType> {
  private readonly userApi = inject(UserApi);
  private readonly forgotPasswordService = inject(ForgotPasswordService);

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
    const email = this.forgotPasswordService.getEmail();
    const otp = this.forgotPasswordService.getOtp();
    const password = this.form.getRawValue().password as string;

    const dto = { email, otp, password };
    this.userApi.recoverPassword(dto).subscribe((res) => {
      // TODO 비밀번호 변경 성공적으로 이루어졌을 때 나타나는 모달
      console.log(res, '비밀번호 찾기 성공');
    });
  }
}
