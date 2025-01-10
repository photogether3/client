import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OtpFormType } from 'src/entities/auth';
import { OTP_REGEX } from 'src/shared/const';

@Component({
  selector: 'verify-otp-page',
  templateUrl: './verify-otp.page.html',
  imports: [ReactiveFormsModule],
})
export class VerifyOtpPage {
  public otpForm!: FormGroup;

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
    console.log('otp 인증!');
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
