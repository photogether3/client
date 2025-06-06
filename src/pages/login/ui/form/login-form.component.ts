import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { catchError, finalize } from 'rxjs';

import { AuthApi, LoginFormType, TokenService } from 'src/entities/auth';
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
export class LoginFormComponent extends BaseForm<LoginFormType> implements OnInit {
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);
  private readonly STORAGE_KEY = 'login_credentials';

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

  async ngOnInit() {
    // 컴포넌트 초기화 시 저장된 로그인 정보 확인하여 폼에 채우기
    await this.loadSavedCredentials();
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
      rememberMe: [false], // 로그인 상태 유지 기본값: false
    });
  }

  onLogin() {
    if (!this.isValid()) return;

    const formValue = this.getRawValue();
    const loginDTO = {
      email: formValue.email,
      password: formValue.password,
    };

    const rememberMe = formValue.rememberMe;

    this.authApi
      .login(loginDTO)
      .pipe(
        catchError((error) => {
          if (error.error.code === 'EMAIL_NOT_VERIFIED') {
            this.router.navigateByUrl('/otp-verify');
          }
          throw error;
        }),
        finalize(async () => {
          // 로그인 상태 유지가 선택된 경우 정보 저장
          if (rememberMe) {
            await this.saveCredentials(formValue.email, formValue.password);
          } else {
            // 체크 해제된 상태면 저장된 정보 삭제
            await this.clearCredentials();
          }
        }),
      )
      .subscribe(async (res) => {
        if (!res) {
          return;
        }

        const instance = TokenService.getInstance();
        await instance.store(res);
        this.router.navigateByUrl('/home');
      });
  }

  /**
   * 로그인 정보 저장
   */
  private async saveCredentials(email: string, password: string): Promise<void> {
    try {
      // 암호화하면 더 좋겠지만, 간단한 구현을 위해 그대로 저장
      // 실제 프로덕션 환경에서는 암호화를 고려하세요
      await Preferences.set({
        key: this.STORAGE_KEY,
        value: JSON.stringify({ email, password, hasCredentials: true }),
      });
      console.log('로그인 정보 저장 완료');
    } catch (error) {
      console.error('로그인 정보 저장 중 오류 발생:', error);
    }
  }

  /**
   * 저장된 로그인 정보 불러오기
   */
  private async loadSavedCredentials(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: this.STORAGE_KEY });

      if (!value) {
        return;
      }

      const savedCredentials = JSON.parse(value);
      if (savedCredentials.hasCredentials) {
        // 실제 로그인 자격 증명이 맞다면 폼에 값을 채움
        this.form.patchValue({
          email: savedCredentials.email,
          password: savedCredentials.password,
          rememberMe: true,
        });
        console.log('저장된 로그인 정보 로드 완료');
      }
    } catch (error) {
      console.error('저장된 로그인 정보 로드 중 오류 발생:', error);
    }
  }

  /**
   * 저장된 로그인 정보 삭제
   */
  private async clearCredentials(): Promise<void> {
    try {
      await Preferences.remove({ key: this.STORAGE_KEY });
      console.log('저장된 로그인 정보 삭제 완료');
    } catch (error) {
      console.error('저장된 로그인 정보 삭제 중 오류 발생:', error);
    }
  }
}
