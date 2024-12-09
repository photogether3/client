import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginFormT } from '../../entities/login';

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

  loginForm = new FormGroup<LoginFormT>({
    username: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
  })

  onLogin() {
    console.log('로그인');
  }
}
