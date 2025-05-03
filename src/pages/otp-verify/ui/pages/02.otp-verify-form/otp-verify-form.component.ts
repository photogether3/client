import { Component, effect, inject, OnDestroy, output, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { interval, Subscription, take, takeWhile } from 'rxjs';

import { AuthApi, AuthService, OtpFormType } from 'src/entities/auth';
import { ButtonComponent, InputComponent, ModalReactiveService } from 'src/shared/components';
import { OTP_REGEX } from 'src/shared/const';
import { BaseForm } from 'src/shared/lib';
import { StepService } from 'src/shared/services';
import { FooterWidget } from 'src/widgets/footer';

@Component({
  selector: 'otp-verify-form',
  templateUrl: './otp-verify-form.component.html',
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent, FooterWidget],
  host: {
    class: 'flex min-h-screen flex-1 flex-col border-x bg-layer40',
  },
})
export class OtpVerifyFormComponent extends BaseForm<OtpFormType> implements OnDestroy {
  private readonly authApi = inject(AuthApi);
  private readonly modalReactiveService = inject(ModalReactiveService);
  private readonly router = inject(Router);
  private readonly stepService = inject(StepService);

  isFormValid = output<boolean>();
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

    effect(() => {
      if (!this.email()) {
        console.log('이메일이 없습니다.');
      }

      this.authApi
        .generateOtp({ email: this.email() })
        .pipe(take(1))
        .subscribe({
          next: () => this.startTimer(),
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
          });
        }
      },
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

  onNext() {
    const otp = this.getRawValue().otp;
    const formValue = {
      email: this.email(),
      otp: otp,
    };

    this.authApi.verifyOtpWithJwt(formValue).subscribe({
      next: (res) => {
        const instance = AuthService.getInstance();
        instance.store(res);

        const router = this.stepService.getExtraData('page');

        if (router === 'otp-verify') {
          this.router.navigateByUrl('/onboarding');
        } else {
          this.stepService.setExtraData('otp', otp).nextStep();
        }
      },
    });
  }
}
