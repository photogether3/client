import { Routes } from '@angular/router';
import { AuthGuard } from 'src/entities/auth';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('../pages/login/ui/page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('../pages/register/ui/page').then((m) => m.RegisterPage),
  },
  {
    path: 'verify-otp',
    loadComponent: () => import('../pages/verify-otp/ui/page').then((m) => m.VerifyOtpPage),
  },
  {
    path: 'home',
    loadComponent: () => import('../pages/home').then((m) => m.HomePage),
    canActivate: [AuthGuard],
  },
];
