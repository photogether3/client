import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApi, AuthService, OtpFormType } from 'src/entities/auth';
import { OTP_REGEX } from 'src/shared/const';
import crypto from 'crypto-js';

@Component({
  selector: 'verify-otp-form',
  templateUrl: './verify-otp-form.component.html',
  imports: [ReactiveFormsModule],
})
export class VerifyOtpFormComponent {
  public email: string = '';
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

    const navigation = this.router.getCurrentNavigation();
    this.email = navigation?.extras?.state?.['email'] || null;
  }

  onVerify() {
    const otp = this.otpForm.getRawValue().otp;
    const deviceId = crypto.SHA256(new Date().getTime().toString()).toString();
    const deviceModel = navigator.userAgent;
    const deviceOs = navigator.platform;

    console.log(deviceId, 'deviceId');
    console.log(deviceModel, 'diviceModel');
    console.log(deviceOs, 'deviceOs');

    const formValue = {
      email: this.email,
      otp: otp,
      deviceId,
      deviceModel,
      deviceOs,
    };

    console.log(formValue);
    this.authApi.verifyOtp(formValue).subscribe((res) => {
      const instance = AuthService.getInstance();
      instance.store(res);

      // TODO 디바이스 id 로컬스토리지 저장 서비스 분리
      localStorage.setItem('deviceId', deviceId);
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
