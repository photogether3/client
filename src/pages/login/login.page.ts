import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginFormT } from '../../app/entities/login';
import { JsonPipe } from '@angular/common';

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
}
