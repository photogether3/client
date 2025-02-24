import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApi, RegisterFormType } from 'src/entities/auth';
import { AuthValidators } from 'src/entities/auth/custom-validators';
import { UserApi } from 'src/entities/user';
import { ButtonComponent, InputComponent } from 'src/shared/components';
import { PASSWORD_REGEX } from 'src/shared/const';
import { BaseForm } from 'src/shared/lib';
import { VALIDATION_SERVICE } from 'src/shared/lib/validation.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent],
  providers: [
    {
      provide: VALIDATION_SERVICE,
      useClass: AuthValidators,
    },
  ],
})
export class RegisterFormComponent extends BaseForm<RegisterFormType> {
  private readonly authApi = inject(AuthApi);
  private readonly userApi = inject(UserApi);
  private readonly router = inject(Router);

  constructor() {
    super();

    this.errorMessages = {
      email: {
        required: '이메일은 필수입니다.',
        email: '유효한 이메일 형식이 아닙니다.',
        duplicateEmail: '사용 중인 이메일입니다.',
      },
      password: {
        required: '비밀번호는 필수입니다.',
        pattern: '비밀번호는 8~15자이며, 숫자, 영문자, 특수문자를 포함해야 합니다.',
      },
      confirmPassword: {
        required: '비밀번호 확인은 필수입니다.',
        fieldMismatch: '비밀번호가 일치하지 않습니다.',
      },
    };
  }

  protected initForm() {
    this.form = this.fb.group({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.validationService.asyncValidateField((email) => this.userApi.checkDuplicatedEmail(email))],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.pattern(PASSWORD_REGEX)],
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required],
        asyncValidators: [this.validationService.validateMatchingFields('password', 'confirmPassword')],
      }),
    });
  }

  onRegister() {
    // form.value와 form.getRawValue의 차이점 !
    const formData = this.getRawValue();

    this.authApi.register(formData).subscribe(() => {
      this.router.navigateByUrl('/otp/verify', {
        state: {
          email: formData.email,
        },
      });
    });
  }
}
