import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'signup', loadComponent: () => import('./auth/signup/signup.component').then(m => m.SignupComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    pathMatch: 'full'
  },
  { path: '**', redirectTo: '' }
];
