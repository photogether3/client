import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApi, AuthService, OtpFormType } from 'src/entities/auth';
import { ButtonComponent } from 'src/shared/components';
import { OTP_REGEX } from 'src/shared/const';

@Component({
  selector: 'verify-otp-form',
  templateUrl: './verify-otp-form.component.html',
  imports: [ReactiveFormsModule, ButtonComponent],
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

    const formValue = {
      email: this.email,
      otp: otp,
    };

    console.log(formValue);
    this.authApi.verifyOtp(formValue).subscribe((res) => {
      const instance = AuthService.getInstance();
      instance.store(res);

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
