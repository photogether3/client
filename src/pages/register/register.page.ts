import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SignUpFormT } from '../../entities/auth';

@Component({
  selector: 'register-page',
  templateUrl: './register.page.html',
  imports: [ReactiveFormsModule, JsonPipe, RouterLink]
})
export class RegisterPage {
  public signUpForm = new FormGroup<SignUpFormT>({
    name: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
  })

  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() { }

  onSignUp() {
    console.log('회원가입');
    this.http.post('server_url', this.signUpForm).subscribe((res: any) => {
      if (res) {
        alert('회원가입 성공! ✨');
        localStorage.setItem('accessToken', res.accessToken);
        this.router.navigateByUrl('/home');
      } else {
        alert('회원가입 실패 😥')
      }
    })
  }
}
