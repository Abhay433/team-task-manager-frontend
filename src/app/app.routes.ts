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
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
       { path: 'teams', loadComponent: () => import('./features/teams/team-management/team-management.component').then(m => m.TeamManagementComponent) },
       { path: 'projects/:projectId', loadComponent: () => import('./features/projects/project-details/project-details.component').then(m => m.ProjectDetailsComponent) },
       { path: '', loadComponent: () => import('./features/dashboard/home/home.component').then(m => m.HomeComponent) }
    ]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  { path: '**', redirectTo: 'dashboard' }
];
