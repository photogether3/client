import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthApi, LoginFormT } from '../../entities/auth';

@Component({
  selector: 'login-page',
  templateUrl: './login.page.html',
  imports: [ReactiveFormsModule, JsonPipe, RouterLink]
})
export class LoginPage {
  public loginForm = new FormGroup<LoginFormT>({
    username: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
  })

  private authApi = inject(AuthApi);
  private router = inject(Router);

  constructor() { }

  onLogin() {
    const loginObj = this.loginForm.getRawValue();

    this.authApi.onLogin(loginObj).subscribe((res: any) => {
      if (res) {
        alert('로그인 성공! ✨');
        localStorage.setItem('accessToken', res.accessToken);
        this.router.navigateByUrl('/home');
      } else {
        alert('로그인 실패 😥')
      }
    })
  }
}
