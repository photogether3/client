import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { App } from '@capacitor/app';

import { KakaoAuthService } from 'src/entities/auth';
import { ButtonComponent, IconComponent } from 'src/shared/components';

import { LoginFormComponent } from '../form';

@Component({
  selector: 'login-page',
  templateUrl: './login.page.html',
  imports: [RouterLink, LoginFormComponent, IconComponent, ButtonComponent, IconComponent],
  host: {
    class: 'flex h-full flex-col items-center justify-center gap-5 px-10 py-5',
  },
})
export class LoginPage {
  private readonly router = inject(Router);
  private readonly kakaoAuthService = inject(KakaoAuthService);

  constructor() {
    App.addListener('appUrlOpen', (data) => {
      this.kakaoAuthService.handleRedirect(data.url);
    });
  }

  goRegisterPage() {
    this.router.navigateByUrl('/register');
  }

  loginWithKakao() {
    this.kakaoAuthService.loginWithKakao();
  }
}
