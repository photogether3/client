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
    path: 'otp/verify',
    loadComponent: () => import('../pages/otp-verify/ui/page').then((m) => m.OtpVerifyPage),
  },
  {
    path: 'onboarding',
    loadComponent: () => import('../pages/onboarding').then((m) => m.OnboardingPage),
  },
  {
    path: 'home',
    loadComponent: () => import('../pages/home').then((m) => m.HomePage),
    canActivate: [AuthGuard],
  },
  {
    path: 'collection',
    children: [
      {
        path: 'create',
        loadComponent: () => import('../pages/collection/create').then((m) => m.CollectionCreatePage),
      },
      {
        path: ':id',
        loadComponent: () => import('../pages/collection').then((m) => m.CollectionMainPage),
      },
    ],
  },
  {
    path: 'profile',
    children: [
      {
        path: '',
        loadComponent: () => import('../pages/profile/main').then((m) => m.ProfilePage),
      },
      {
        path: 'update',
        loadComponent: () => import('../pages/profile/update').then((m) => m.ProfileUpdatePage),
      },
    ],
  },
  {
    path: 'post',
    children: [
      {
        path: 'create',
        loadComponent: () => import('../pages/post/create').then((m) => m.PostCreatePage),
      },
    ],
  },
];
