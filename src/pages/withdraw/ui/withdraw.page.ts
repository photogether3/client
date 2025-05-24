import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import { Router } from '@angular/router';
import { UserApi } from 'src/entities/user';
import { OtpVerifyFormComponent } from 'src/features';
import { ButtonComponent, ModalReactiveService } from 'src/shared/components';
import { StepService } from 'src/shared/services';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';

@Component({
  selector: 'app-withdraw-page',
  templateUrl: './withdraw.page.html',
  imports: [CommonModule, HeaderWidget, FooterWidget, ButtonComponent, OtpVerifyFormComponent],
  providers: [StepService],
  host: {
    class: 'flex h-screen flex-col',
  },
})
export class WithdrawPage {
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

  withdraw() {
    const otp = this.otpValue();
    this.userApi.withdraw({ otp }).subscribe((res) => {
      console.log('탈퇴 완료', res);
      const modalData = {
        iconName: 'modal-trash',
        subTitle: '회원님의 정보가 모두 삭제 됩니다.',
        content: '확인 버튼을 누르시면 회원님의 모든 기록이 삭제 되며 아이디가 삭제 됩니다. 이 동작은 되돌릴수 없습니다. 원치 않으실 경우 취소 버튼을 눌러주세요.',
        buttons: ['취소', '확인'],
      };
      this.modalReactiveService.open(modalData).then((res) => {
        if (res !== '확인' || !res) {
          return;
        }

        const modalData = {
          title: '회원 탈퇴 완료',
          subTitle: '회원탈퇴가 완료 되었습니다.',
          content: '확인 버튼을 누르시면 로그인 페이지로 이동합니다. 확인버튼을 눌러주세요.',
          buttons: ['확인'],
        };

        this.modalReactiveService.open(modalData).then(() => {
          this.router.navigateByUrl('/login');
        });
      });
    });
  }
}
