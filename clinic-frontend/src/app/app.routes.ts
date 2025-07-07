import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./components/login-page/login-page.component').then(m => m.LoginPageComponent) },
  { path: 'register', loadComponent: () => import('./components/register-page/register-page.component').then(m => m.RegisterPageComponent) },
  { path: 'admin', loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: '', loadComponent: () => import('./components/landing-page/landing-page.component').then(m => m.LandingPageComponent) },
];
