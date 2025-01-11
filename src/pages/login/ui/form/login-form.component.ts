import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApi, LoginFormType } from 'src/entities/auth';
import { PASSWORD_REGEX } from 'src/shared/const';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  imports: [ReactiveFormsModule],
})
export class LoginFormComponent {
  public loginForm!: FormGroup<LoginFormType>;

  private authApi = inject(AuthApi);
  private router = inject(Router);
  private readonly errorMessages: Record<string, Record<string, string>> = {
    email: {
      required: '이메일은 필수입니다.',
      email: '유효한 이메일 형식이 아닙니다.',
    },
    password: {
      required: '비밀번호는 필수입니다.',
      pattern: '비밀번호는 8~15자이며, 숫자, 영문자, 특수문자를 포함해야 합니다.',
    },
  };

  constructor() {
    this.loginForm = new FormGroup<LoginFormType>({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        updateOn: 'change',
        nonNullable: true,
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.pattern(PASSWORD_REGEX)],
        updateOn: 'change',
        nonNullable: true,
      }),
    });
  }

  onLogin() {
    const loginObj = this.loginForm.getRawValue();
    const deviceId = localStorage.getItem('deviceId');

    if (deviceId) {
      const loginDTO = { ...loginObj, deviceId };

      this.authApi.login(loginDTO).subscribe((res) => {
        if (res) {
          alert('로그인 성공! ✨');
          this.router.navigateByUrl('/home');
        } else {
          alert('로그인 실패 😥');
        }
      });
    } else {
      alert('deviceId가 없습니다!');
    }
  }

  getErrorMessage(controlName: keyof LoginFormType): string | null {
    const control = this.loginForm.get(controlName);

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
