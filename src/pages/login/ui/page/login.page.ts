import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ButtonComponent, IconComponent } from 'src/shared/components';

import { LoginFormComponent } from '../form';

@Component({
  selector: 'login-page',
  templateUrl: './login.page.html',
  imports: [RouterLink, LoginFormComponent, IconComponent, ButtonComponent],
  host: {
    class: 'flex h-full flex-col items-center justify-between p-10',
  },
})
export class LoginPage {
  private readonly router = inject(Router);

  constructor() {}

  goRegisterPage() {
    this.router.navigateByUrl('/register');
  }
}
