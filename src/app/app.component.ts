import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';

import { ToastComponent } from 'src/shared/components';
import { LoadingComponent, LoadingService } from 'src/shared/components/loading';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public readonly isLoading = computed(() => this.loadingService.loading());

  private readonly loadingService = inject(LoadingService);
  private readonly platform = inject(Platform);

  private backButtonPressCount = 0;
  private backButtonTimer: any = null;

  constructor() {
    this.initializeApp();
    this.setupBackButtonHandler();
  }

  async initializeApp() {
    await this.platform.ready();
  }

  /**
   * 뒤로가기 버튼 핸들러 설정
   */
  private setupBackButtonHandler() {
    App.addListener('backButton', () => {
      if (this.backButtonPressCount === 0) {
        // 첫 번째 뒤로가기 버튼 클릭
        this.backButtonPressCount++;
        this.showExitToast();

        // 2초 후 카운트 초기화
        this.backButtonTimer = setTimeout(() => {
          this.backButtonPressCount = 0;
        }, 2000);
      } else {
        // 2초 내에 두 번째 클릭 시 앱 종료
        if (this.backButtonTimer) {
          clearTimeout(this.backButtonTimer);
        }
        App.exitApp();
      }
    });
  }

  /**
   * 앱 종료 안내 토스트 표시 (임시 방편, 이후에 변경해야함)
   */
  private showExitToast() {
    const toast = document.createElement('div');
    toast.textContent = '한 번 더 누르면 앱이 종료됩니다.';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = 'rgba(0,0,0,0.7)';
    toast.style.color = 'white';
    toast.style.padding = '10px';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '9999';

    document.body.appendChild(toast);

    setTimeout(() => {
      document.body.removeChild(toast);
    }, 2000);
  }
}
