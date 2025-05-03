import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';

import { AuthApi, AuthService, LoginFormType } from 'src/entities/auth';
import { ButtonComponent, InputComponent } from 'src/shared/components';
import { PASSWORD_REGEX } from 'src/shared/const';
import { BaseForm } from 'src/shared/lib';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styles: `
    :host {
      width: 100%;
    }
  `,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent],
})
export class LoginFormComponent extends BaseForm<LoginFormType> {
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);

  constructor() {
    super();

    this.errorMessages = {
      email: {
        required: '이메일은 필수입니다.',
        email: '유효한 이메일 형식이 아닙니다.',
      },
      password: {
        required: '비밀번호는 필수입니다.',
        pattern: '비밀번호는 8~15자이며, 숫자, 영문자, 특수문자를 포함해야 합니다.',
      },
    };
  }

  protected initForm() {
    this.form = this.fb.group({
      email: [
        '',
        {
          validators: [Validators.required, Validators.email],
        },
      ],
      password: [
        '',
        {
          validators: [Validators.required, Validators.pattern(PASSWORD_REGEX)],
        },
      ],
    });
  }

  onLogin() {
    const loginDTO = this.getRawValue();

    this.authApi
      .login(loginDTO)
      .pipe(
        catchError((error) => {
          // TODO 백엔드 에러 코드에 따라 에러 메시지 처리
          console.log('Login error:', error.error.message);
          if (error.error.message === '이메일 인증을 완료해주세요.') {
            this.router.navigateByUrl('/otp-verify');
          }
          throw error;
        }),
      )
      .subscribe((res) => {
        if (res) {
          alert('로그인 성공! ✨');

          const instance = AuthService.getInstance();
          instance.store(res);

          this.router.navigateByUrl('/home');
        } else {
          alert('로그인 실패 😥');
        }
      });
  }
}
