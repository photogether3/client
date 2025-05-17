import { authGuard } from 'src/entities/auth';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('../pages/login/ui/page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('../pages/register/ui/pages').then((m) => m.RegisterPage),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('../pages/forgot-password').then((m) => m.ForgotPasswordPage),
  },
  {
    path: 'otp-verify',
    loadComponent: () => import('../pages/otp-verify').then((m) => m.OtpVerifyPage),
  },
  {
    path: 'withdraw',
    loadComponent: () => import('../pages/withdraw').then((m) => m.WithdrawPage),
    canActivate: [authGuard],
  },
  {
    path: 'reset',
    loadComponent: () => import('../pages/reset').then((m) => m.ResetPage),
    canActivate: [authGuard],
  },

  {
    path: 'password-update',
    loadComponent: () => import('../pages/password-update').then((m) => m.PasswordUpdatePage),
    canActivate: [authGuard],
  },
  {
    path: 'onboarding',
    loadComponent: () => import('../pages/onboarding').then((m) => m.OnboardingPage),
    canActivate: [authGuard],
  },
  {
    path: 'home',
    loadComponent: () => import('../pages/home').then((m) => m.HomePage),
    canActivate: [authGuard],
  },
  {
    path: 'collection',
    canActivate: [authGuard],
    children: [
      {
        path: 'create',
        loadComponent: () => import('../pages/collection/create').then((m) => m.CollectionCreatePage),
      },
      {
        path: 'update/:id',
        loadComponent: () => import('../pages/collection/update').then((m) => m.CollectionUpdatePage),
      },
      {
        path: ':id',
        loadComponent: () => import('../pages/collection').then((m) => m.CollectionMainPage),
      },
    ],
  },
  {
    path: 'profile',
    canActivate: [authGuard],
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
    canActivate: [authGuard],
    children: [
      {
        path: 'create',
        loadComponent: () => import('../pages/post/create').then((m) => m.PostCreatePage),
      },
      {
        path: 'update/:id',
        loadComponent: () => import('../pages/post/update').then((m) => m.PostUpdatePage),
      },
      {
        path: ':id',
        loadComponent: () => import('../pages/post/detail').then((m) => m.PostDetailPage),
      },
    ],
  },
  {
    path: 'demo',
    loadComponent: () => import('../pages/demo').then((m) => m.DemoPage),
  },
];
