import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HeaderWidget } from 'src/widgets/header';

import { RegisterFormComponent } from '../form';

@Component({
  selector: 'register-page',
  templateUrl: './register.page.html',
  imports: [RouterLink, RegisterFormComponent, HeaderWidget],
})
export class RegisterPage {}
