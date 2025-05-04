import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import { Router } from '@angular/router';
import { UserApi } from 'src/entities/user';
import { OtpVerifyFormComponent } from 'src/pages/otp-verify';
import { ButtonComponent, ModalReactiveService } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';

@Component({
  selector: 'app-reset-page',
  templateUrl: './reset.page.html',
  imports: [CommonModule, HeaderWidget, FooterWidget, ButtonComponent, OtpVerifyFormComponent],
})
export class ResetPage {
  private readonly userApi = inject(UserApi);
  private readonly router = inject(Router);
  private readonly modalReactiveService = inject(ModalReactiveService);

  otpValue = signal<string>('');
  email = signal<string>('');

  constructor() {
    this.userApi.getProfile().subscribe((res) => {
      this.email.set(res.email);
    });
  }

  reset() {
    const otp = this.otpValue();
    this.userApi.reset({ otp }).subscribe(() => {
      const modalData = {
        iconName: 'modal-trash',
        subTitle: '회원님의 정보가 모두 초기화 됩니다.',
        content: '확인 버튼을 누르시면 회원님의 모든 기록이 초기화 됩니다. 이 동작은 되돌릴수 없습니다. 원치 않으실 경우 취소 버튼을 눌러주세요.',
        buttons: ['취소', '확인'],
      };
      this.modalReactiveService.open(modalData).then((res) => {
        if (res !== '확인' || !res) {
          return;
        }

        const modalData = {
          title: '기록 초기화 완료',
          subTitle: '기록 초기화가 완료되었습니다.',
          content: '확인 버튼을 누르시면 홈 화면으로 이동합니다. 확인버튼을 눌러주세요.',
          buttons: ['확인'],
        };

        this.modalReactiveService.open(modalData).then(() => {
          this.router.navigateByUrl('/home');
        });
      });
    });
  }
}
