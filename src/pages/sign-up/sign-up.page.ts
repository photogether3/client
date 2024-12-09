import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignUpFormT } from '../../entities/login';

@Component({
  selector: 'sign-up-page',
  templateUrl: './sign-up.page.html',
  imports: [ReactiveFormsModule, JsonPipe]
})
export class signUpPage {
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
