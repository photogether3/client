import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { TokenService } from './token.service';
import { AuthApi } from '../api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);
  private readonly authApi = inject(AuthApi);

  private instance = TokenService.getInstance();

  // 토큰 만료 확인 함수
  async isTokenExpired(): Promise<boolean> {
    const expiresIn = await this.instance.getExpiresIn();

    if (!expiresIn) {
      return true;
    } else {
      const timeUntilExpiry = Number(expiresIn) * 1000 - Date.now();
      return timeUntilExpiry < 5 * 60 * 1000;
    }
  }

  async restoreSession(): Promise<void> {
    const [accessToken, refreshToken] = await Promise.all([this.tokenService.getAccessToken(), this.tokenService.getRefreshToken()]);

    // 둘 다 없으면 재발급 불가 → 로그아웃
    if (!accessToken || !refreshToken) {
      this.tokenService.clear();
      this.router.navigateByUrl('/login');
      return;
    }

    // accessToken이 없거나 만료된 경우 → refresh 시도
    if (await this.isTokenExpired()) {
      try {
        const newTokens = await firstValueFrom(this.authApi.refresh(refreshToken));
        await this.tokenService.store(newTokens);
      } catch {
        this.tokenService.clear();
        this.router.navigateByUrl('/login');
        return;
      }
    }
  }
}
