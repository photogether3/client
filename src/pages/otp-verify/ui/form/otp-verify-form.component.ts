import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { interval, Subscription, takeWhile } from 'rxjs';
import { AuthApi, AuthService, OtpFormType } from 'src/entities/auth';
import { ButtonComponent, InputComponent } from 'src/shared/components';
import { OTP_REGEX } from 'src/shared/const';
import { BaseForm } from 'src/shared/lib';

@Component({
  selector: 'otp-verify-form',
  templateUrl: './otp-verify-form.component.html',
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent],
})
export class OtpVerifyFormComponent extends BaseForm<OtpFormType> implements OnInit, OnDestroy {
  public email: string = '';

  private timeLeft = 300;
  private timerSubscription!: Subscription;
  private authApi = inject(AuthApi);
  private router = inject(Router);

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

    const navigation = this.router.getCurrentNavigation();
    this.email = navigation?.extras?.state?.['email'] || null;
  }

  protected override initForm(): void {
    this.form = this.fb.group({
      otp: this.fb.control('', {
        validators: [Validators.required, Validators.pattern(OTP_REGEX), Validators.minLength(6), Validators.maxLength(6)],
      }),
    });
  }

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    this.timerSubscription = interval(1000)
      .pipe(takeWhile(() => this.timeLeft > 0))
      .subscribe(() => {
        this.timeLeft--;
      });
  }

  onVerify() {
    const otp = this.getRawValue().otp;

    const formValue = {
      email: this.email,
      otp: otp,
    };

    this.authApi.verifyOtp(formValue).subscribe((res) => {
      const instance = AuthService.getInstance();
      instance.store(res);

      this.router.navigateByUrl('/onboarding');
    });
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
