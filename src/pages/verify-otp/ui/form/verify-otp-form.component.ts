import { Component, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApi, OtpFormType } from 'src/entities/auth';
import { OTP_REGEX } from 'src/shared/const';

@Component({
  selector: 'verify-otp-form',
  templateUrl: './verify-otp-form.component.html',
  imports: [ReactiveFormsModule],
})
export class VerifyOtpFormComponent {
  public email = input<string>('');
  public otpForm!: FormGroup;

  private authApi = inject(AuthApi);
  private router = inject(Router);

  private readonly errorMessages: Record<string, string> = {
    required: 'otp인증은 필수입니다.',
    pattern: '숫자만 입력해주세요.',
    minlength: '최소 6글자입니다.',
  };

  constructor() {
    this.otpForm = new FormGroup<OtpFormType>({
      otp: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6), Validators.pattern(OTP_REGEX)],
        updateOn: 'change',
      }),
    });
  }

  onVerify() {
    const otp = this.otpForm.getRawValue().otp;
    // TODO deviceId 어떻게 설정
    const deviceId = 'test';
    const deviceModel = navigator.userAgent;
    const deviceOs = navigator.platform;

    console.log(deviceId, 'deviceId');
    console.log(deviceModel, 'diviceModel');
    console.log(deviceOs, 'deviceOs');

    const formValue = {
      email: this.email(),
      otp: otp,
      deviceId,
      deviceModel,
      deviceOs,
    };

    console.log(formValue);
    this.authApi.verifyOtp(formValue).subscribe((res) => {
      // TODO 토큰 저장
      console.log(res);
      console.log('otp 인증 성공!');

      this.router.navigateByUrl('/home');
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
}
