import { Component, effect, inject, input, OnDestroy, output, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { interval, Subscription, take, takeWhile } from 'rxjs';

import { AuthApi, OtpFormType } from 'src/entities/auth';
import { ButtonComponent, InputComponent, ModalReactiveService } from 'src/shared/components';
import { OTP_REGEX } from 'src/shared/const';
import { BaseForm } from 'src/shared/lib';
import { StepService } from 'src/shared/services';

@Component({
  selector: 'otp-verify-form',
  templateUrl: './otp-verify-form.component.html',
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent],
  host: {
    class: 'flex-1',
  },
})
export class OtpVerifyFormComponent extends BaseForm<OtpFormType> implements OnDestroy {
  /**
   * 비밀번호 찾기 페이지 (스텝서비스)
   * otp 인증 페이지 - 로그인 페이지에서 로그인 버튼 클릭시 이메일 인증 안 되었을 때 해당 페이지로 이동 (스텝서비스)
   * 회원가입 otp 체크 페이지 (페이지 버튼o, 스텝서비스)
   * 기록초기화 (페이지 버튼o, 템플릿)
   * 회원탈퇴 페이지 (페이지 버튼o, 템플릿)
   */
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);
  private readonly modalReactiveService = inject(ModalReactiveService);
  private readonly stepService = inject(StepService);

  emailInput = input<string>('');

  otp = output<string>();

  isVerified = signal<boolean>(false);
  email = signal<string>('');

  private timeLeft = 300;
  private timerSubscription!: Subscription;

  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}분 ${seconds < 10 ? '0' : ''}${seconds}초`;
  }

  constructor() {
    super();

    const email = this.stepService.getExtraData('email');
    this.email.set(email);

    this.errorMessages = {
      otp: {
        required: 'otp인증은 필수입니다.',
        pattern: '숫자만 입력해주세요.',
        minlength: '최소 6글자입니다.',
        maxlength: '최대 6글자입니다.',
      },
    };

    effect(() => this.requestOtp());
  }

  protected override initForm(): void {
    this.form = this.fb.group({
      otp: this.fb.control('', {
        validators: [Validators.required, Validators.pattern(OTP_REGEX), Validators.minLength(6), Validators.maxLength(6)],
      }),
    });
  }

  onVerify() {
    const otp = this.getRawValue().otp;

    const formValue = {
      email: this.email() || this.emailInput(),
      otp: otp,
    };

    this.authApi.sendOtpVerification(formValue).subscribe({
      next: (res) => {
        if (res.message === '성공') {
          const modalData = {
            iconName: 'modal-security',
            subTitle: 'OTP 인증이 완료 되었습니다.',
            content: '확인 버튼을 누르시면 계속 진행하실수 있습니다. 확인버튼을 눌러주세요.',
            buttons: ['확인'],
          };
          this.modalReactiveService.open(modalData).then(() => {
            this.isVerified.set(true);
            this.otp.emit(otp);
          });
        }
      },
    });
  }

  requestOtp() {
    const email = this.email() || this.emailInput();

    if (!email) {
      return;
    }

    this.authApi
      .generateOtp({ email })
      .pipe(take(1))
      .subscribe({
        next: () => this.startTimer(),
      });
  }

  private startTimer() {
    this.clearTimer();
    this.timeLeft = 300;

    this.timerSubscription = interval(1000)
      .pipe(takeWhile(() => this.timeLeft > 0))
      .subscribe(() => {
        this.timeLeft--;
      });
  }

  private clearTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.clearTimer();
  }
}
