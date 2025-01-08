import { JsonPipe } from '@angular/common';
import { AuthApi, SignUpFormT } from 'src/entities/auth';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'register-page',
  templateUrl: './register.page.html',
  imports: [ReactiveFormsModule, JsonPipe, RouterLink]
})
export class RegisterPage {
  public signUpForm = new FormGroup<SignUpFormT>({
    email: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
  })

  private authApi = inject(AuthApi);
  private router = inject(Router);

  constructor() { }

  onRegister(){
    // form.value와 form.getRawValue의 차이점 ! 
    const formData = this.signUpForm.getRawValue();

    this.authApi.onRegister(formData).subscribe(() => {
      this.router.navigateByUrl('/verify-otp');
    })
  }
}
