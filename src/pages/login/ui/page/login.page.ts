import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ButtonComponent, IconComponent } from 'src/shared/components';

import { LoginFormComponent } from '../form';

@Component({
  selector: 'login-page',
  templateUrl: './login.page.html',
  imports: [RouterLink, LoginFormComponent, IconComponent, ButtonComponent],
})
export class LoginPage {
  private readonly router = inject(Router);

  constructor() {}

  goRegisterPage() {
    this.router.navigateByUrl('/register');
  }
}
