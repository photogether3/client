import { Routes } from '@angular/router';
import { LoginPage } from '../pages/login';
import { HomePage } from '../pages/home';
import { signUpPage } from '../pages/sign-up';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    component: LoginPage
  },
  {
    path: 'sign-up',
    component: signUpPage
  },
  {
    path: 'home',
    component: HomePage
  }
];
