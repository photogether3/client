import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginFormT } from '../../entities/login';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'login-page',
  templateUrl: './login.page.html',
  imports: [ReactiveFormsModule, JsonPipe]
})
export class LoginPage {
  // private fb = inject(FormBuilder);
  // loginForm = this.fb.group({
  //   username: [''],
  //   password: ['']
  // })

  public loginForm = new FormGroup<LoginFormT>({
    username: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
  })

  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() { }

  onLogin() {
    console.log('로그인');
    this.http.post('server_url', this.loginForm).subscribe((res: any) => {
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
