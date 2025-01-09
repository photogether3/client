import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthApi, SignUpFormT } from 'src/entities/auth';
import { UserApi } from 'src/entities/user';

@Component({
  selector: 'register-page',
  templateUrl: './register.page.html',
  imports: [ReactiveFormsModule, RouterLink]
})
export class RegisterPage implements OnInit {
  public signUpForm = new FormGroup<SignUpFormT>({
    email: new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true }),
    password: new FormControl('', { validators: [Validators.required], nonNullable: true }),
  })
  public isLoading = signal<boolean>(false);
  public message = signal<string | null>(null);

  private readonly authApi = inject(AuthApi);
  private readonly userApi = inject(UserApi);
  private readonly router = inject(Router);

  constructor() { }

  ngOnInit(){
    this.signUpForm.get('email')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(email => {
        const emailControl = this.signUpForm.get('email');

        if(emailControl?.invalid){
          if(emailControl.errors?.['email']){
            this.message.set('유효한 이메일 형식이 아닙니다.');
          }
          return;
        }

        if(email) {
          this.message.set(null);
          this.isLoading.set(true);
  
          this.userApi.onDuplicateEmail(email).subscribe({
            next: (res) => {
              if(res.isDuplicate){
                this.message.set('사용중인 이메일입니다.');
              } else {
                this.message.set(null);
              }
              this.isLoading.set(false);
            }, 
            error: (err) => {
              this.message.set(err);
              this.isLoading.set(false);
            }
          });
        };
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
