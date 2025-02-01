import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { interval, Subscription, takeWhile } from 'rxjs';
import { AuthApi, AuthService, OtpFormType } from 'src/entities/auth';
import { ButtonComponent } from 'src/shared/components';
import { OTP_REGEX } from 'src/shared/const';

@Component({
  selector: 'verify-otp-form',
  templateUrl: './verify-otp-form.component.html',
  imports: [ReactiveFormsModule, ButtonComponent],
})
export class VerifyOtpFormComponent implements OnInit, OnDestroy {
  public email: string = '';
  public otpForm!: FormGroup;

  private timeLeft = 300;
  private timerSubscription!: Subscription;
  private authApi = inject(AuthApi);
  private router = inject(Router);

  private readonly errorMessages: Record<string, string> = {
    required: 'otp인증은 필수입니다.',
    pattern: '숫자만 입력해주세요.',
    minlength: '최소 6글자입니다.',
  };

  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}분 ${seconds < 10 ? '0' : ''}${seconds}초`;
  }

  constructor() {
    this.otpForm = new FormGroup<OtpFormType>({
      otp: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6), Validators.pattern(OTP_REGEX)],
        updateOn: 'change',
      }),
    });

    const navigation = this.router.getCurrentNavigation();
    this.email = navigation?.extras?.state?.['email'] || null;
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
    const otp = this.otpForm.getRawValue().otp;

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

  getErrorMessage(): string | null {
    const control = this.otpForm.get('otp');

    if (control?.invalid) {
      if (control.hasError('required') && !control.touched) {
        return null;
      }

      const firstErrorKey = Object.keys(control.errors || {})[0];
      return this.errorMessages[firstErrorKey] || null;
    }

    return null;
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
