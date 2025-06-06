import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

import { KakaoAuthApi } from '../api';

type ProviderType = { id: string; email: string };

@Injectable({
  providedIn: 'root',
})
export class KakaoAuthService {
  private readonly kakaoAuthApi = inject(KakaoAuthApi);
  private readonly router = inject(Router);

  private _provider: ProviderType = { id: '', email: '' };

  constructor() {}

  /**
   * 1) 로그인 버튼 클릭 시 호출할 메서드
   *    - 백엔드에서 발급해 주는 “카카오 인증용 URL” 을 가져와 Browser.open() 으로 오픈
   */
  async loginWithKakao(): Promise<void> {
    try {
      const kakaoAuthUrl = this.kakaoAuthApi.getKakaoUrl();
      if (Capacitor.isNativePlatform()) {
        await Browser.open({
          url: kakaoAuthUrl,
        });
      } else {
        window.open(kakaoAuthUrl, '_blank');
      }
    } catch (error) {
      console.error('[KakaoLoginService] 로그인 URL 가져오기/열기 실패:', error);
      throw error;
    }
  }

  /**
   * 2) 인증 완료 후 앱이 다시 열리면(딥링크)
   *   - 여기서 code를 추출해 상태(UNREGISTER)인지 확인
   *   - 상태가 UNREGISTER면 providerId와 providerEmail을 추출해 setProvider() 호출
   */
  async handleRedirect(url: string): Promise<void> {
    if (!url.startsWith('photogether://auth/success')) {
      return;
    }

    let queryString = url.split('?')[1];
    queryString = queryString.replace(/&amp;/g, '&');

    const params = new URLSearchParams(queryString);
    const code = params.get('code');
    const providerId = params.get('providerId');
    const providerEmail = params.get('providerEmail');

    if (code === 'UNREGISTER') {
      this.setProvider({ id: providerId || '', email: providerEmail || '' });
    }

    this.router.navigateByUrl('/home');

    Browser.close();
  }

  registerKakao(dto: { provider: string; providerId: string; providerEmail: string; policyIds: number[] }) {
    return this.kakaoAuthApi.kakaoRegister(dto);
  }

  setProvider(data: ProviderType) {
    this._provider = data;
  }

  getProvider(): ProviderType {
    return this._provider;
  }
}
