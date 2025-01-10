import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthApi, SignUpFormT } from 'src/entities/auth';
import { UserApi } from 'src/entities/user';
import { CommonModule } from '@angular/common';
import { CustomValidators } from 'src/shared/validators';

@Component({
  selector: 'register-page',
  templateUrl: './register.page.html',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
})
export class RegisterPage implements OnInit {
  public signUpForm!: FormGroup<SignUpFormT>;
  public errorMessage = signal<Record<string, string | null>>({
    email: null,
    confirmPassword: null,
  });

  private readonly authApi = inject(AuthApi);
  private readonly userApi = inject(UserApi);
  private readonly router = inject(Router);
  private readonly customValidators = inject(CustomValidators);

  ngOnInit() {
    this.subscribeToStatusChanges('email', {
      required: '이메일은 필수입니다.',
      email: '유효한 이메일 형식이 아닙니다.',
      duplicateEmail: '사용 중인 이메일입니다.',
    });

    this.subscribeToStatusChanges('confirmPassword', {
      required: '비밀번호 확인은 필수입니다.',
      passwordMismatch: '비밀번호가 일치하지 않습니다.',
    });
  }

  constructor() {
    this.signUpForm = new FormGroup<SignUpFormT>({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.customValidators.checkDuplicateEmail((email) => this.userApi.onDuplicateEmail(email))],
        updateOn: 'change',
        nonNullable: true,
      }),
      password: new FormControl('', { validators: [Validators.required], nonNullable: true }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required],
        asyncValidators: [this.customValidators.checkPasswordMatch()],
        updateOn: 'change',
        nonNullable: true,
      }),
    });
  }

  onRegister() {
    // form.value와 form.getRawValue의 차이점 !
    const formData = this.signUpForm.getRawValue();

    this.authApi.onRegister(formData).subscribe(() => {
      this.router.navigateByUrl('/verify-otp');
    });
  }

  private subscribeToStatusChanges(controlName: keyof SignUpFormT, errorMap: Record<string, string>) {
    this.signUpForm.get(controlName)?.statusChanges.subscribe((status) => {
      if (status === 'INVALID') {
        const control = this.signUpForm.get(controlName);
        const errors = control?.errors;
        console.log(errors);

        if (errors) {
          const firstErrorKey = Object.keys(errors)[0];
          this.errorMessage.update((current) => ({
            ...current,
            [controlName]: errorMap[firstErrorKey] || null,
          }));
        }
      } else {
        this.errorMessage.update((current) => ({
          ...current,
          [controlName]: null,
        }));
      }
    });
  }
}
