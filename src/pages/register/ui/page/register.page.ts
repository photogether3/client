import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RegisterFormComponent } from '../form';

@Component({
  selector: 'register-page',
  templateUrl: './register.page.html',
  imports: [RouterLink, RegisterFormComponent],
})
export class RegisterPage {

}
