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
  imports: [ReactiveFormsModule, RouterLink, CommonModule]
})
export class RegisterPage implements OnInit {
  public signUpForm!: FormGroup<SignUpFormT>;
  public message = signal<string | null>(null);

  private readonly authApi = inject(AuthApi);
  private readonly userApi = inject(UserApi);
  private readonly router = inject(Router);
  private readonly customValidators = inject(CustomValidators);

  ngOnInit() {
    this.signUpForm.get('email')?.statusChanges.subscribe((status) => {
      if (status === 'INVALID') {
        const emailControl = this.signUpForm.get('email');

        if (emailControl?.hasError('required')) {
          this.message.set('이메일은 필수입니다.');
        } else if (emailControl?.hasError('email')) {
          this.message.set('유효한 이메일 형식이 아닙니다.');
        } else if (emailControl?.hasError('duplicateEmail')) {
          this.message.set('사용 중인 이메일입니다.');
        }
      } else {
        this.message.set(null); 
      }
    });

  }

  constructor() {
    this.signUpForm = new FormGroup<SignUpFormT>({
      email: new FormControl('', { 
        validators: [Validators.required, Validators.email], 
        asyncValidators: [this.customValidators.checkDuplicateEmail((email) => this.userApi.onDuplicateEmail(email))],
        updateOn: 'change', 
        nonNullable: true
      }),
      password: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    })
   }

  onRegister(){
    // form.value와 form.getRawValue의 차이점 ! 
    const formData = this.signUpForm.getRawValue();

    this.authApi.onRegister(formData).subscribe(() => {
      this.router.navigateByUrl('/verify-otp');
    })
  }
}
