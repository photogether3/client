import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginFormComponent } from '../form';

@Component({
  selector: 'login-page',
  templateUrl: './login.page.html',
  imports: [RouterLink, LoginFormComponent],
})
export class LoginPage {
  constructor() {}
}
