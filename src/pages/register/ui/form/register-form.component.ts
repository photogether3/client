import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApi, RegisterFormType } from 'src/entities/auth';
import { UserApi } from 'src/entities/user';
import { PASSWORD_REGEX } from 'src/shared/const';
import { CustomValidators } from 'src/shared/validators';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  imports: [ReactiveFormsModule],
})
export class RegisterFormComponent {
  public signUpForm!: FormGroup<RegisterFormType>;

  private readonly authApi = inject(AuthApi);
  private readonly userApi = inject(UserApi);
  private readonly router = inject(Router);
  private readonly customValidators = inject(CustomValidators);
  private readonly errorMessages: Record<string, Record<string, string>> = {
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
      passwordMismatch: '비밀번호가 일치하지 않습니다.',
    },
  };

  constructor() {
    this.signUpForm = new FormGroup<RegisterFormType>({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.customValidators.checkDuplicateEmail((email) => this.userApi.onDuplicateEmail(email))],
        updateOn: 'change',
        nonNullable: true,
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.pattern(PASSWORD_REGEX)],
        updateOn: 'change',
        nonNullable: true,
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required],
        asyncValidators: [this.customValidators.checkPasswordMatch()],
        updateOn: 'change',
        nonNullable: true,
      }),
    });
  }

  onRegister() {
    // form.value와 form.getRawValue의 차이점 !
    const formData = this.signUpForm.getRawValue();

    this.authApi.register(formData).subscribe(() => {
      // TODO email 저장 리펙토링 필요
      localStorage.setItem('email', formData.email);
      this.router.navigateByUrl('/verify-otp');
    });
  }

  getErrorMessage(controlName: keyof RegisterFormType): string | null {
    const control = this.signUpForm.get(controlName);

    if (control?.invalid) {
      if (control.hasError('required') && !control.touched) {
        return null;
      }

      const firstErrorKey = Object.keys(control.errors || {})[0];
      return this.errorMessages[controlName][firstErrorKey] || null;
    }

    return null;
  }
}
