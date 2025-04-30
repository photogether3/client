import { Component, effect, inject, input, OnDestroy, output, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import { interval, Subscription, take, takeWhile } from 'rxjs';

import { AuthApi, AuthService, ForgotPasswordService, OtpFormType } from 'src/entities/auth';
import { ButtonComponent, InputComponent } from 'src/shared/components';
import { OTP_REGEX } from 'src/shared/const';
import { BaseForm } from 'src/shared/lib';

@Component({
  selector: 'otp-verify-form',
  templateUrl: './otp-verify-form.component.html',
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent],
})
export class OtpVerifyFormComponent extends BaseForm<OtpFormType> implements OnDestroy {
  private authApi = inject(AuthApi);
  private readonly forgotPasswordService = inject(ForgotPasswordService);

  email = input<string>('');
  isFormValid = output<boolean>();
  isVerified = signal<boolean>(false);
  errorMessage = signal<string>('');
  private timeLeft = 300;
  private timerSubscription!: Subscription;

  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}분 ${seconds < 10 ? '0' : ''}${seconds}초`;
  }

  constructor() {
    super();

    this.errorMessages = {
      otp: {
        required: 'otp인증은 필수입니다.',
        pattern: '숫자만 입력해주세요.',
        minlength: '최소 6글자입니다.',
        maxlength: '최대 6글자입니다.',
      },
    };

    effect(() => {
      const email = this.email();
      if (!email) {
        console.log('이메일이 없습니다.');
      }

      this.authApi
        .generateOtp({ email })
        .pipe(take(1))
        .subscribe({
          next: () => this.startTimer(),
          error: (err) => this.errorMessage.set(err),
        });
    });
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
      email: this.email(),
      otp: otp,
    };

    this.authApi.verifyOtp(formValue).subscribe({
      next: (res) => {
        const instance = AuthService.getInstance();
        instance.store(res);

        // TODO 비밀번호 찾기 페이지 한정 => 수정해야
        this.forgotPasswordService.setOtp(otp);
        this.isVerified.set(true);
      },
      error: (err) => this.errorMessage.set(err),
    });
  }

  // TODO timer 리펙토링
  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private startTimer() {
    this.timerSubscription = interval(1000)
      .pipe(takeWhile(() => this.timeLeft > 0))
      .subscribe(() => {
        this.timeLeft--;
      });
  }
}
