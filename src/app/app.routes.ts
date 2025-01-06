import { Routes } from '@angular/router';
import { LoginPage } from '../pages/login';
import { HomePage } from '../pages/home';
import { RegisterPage } from 'src/pages/register';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'register',
    component: RegisterPage
  },
  {
    path: 'home',
    component: HomePage
  }
];
