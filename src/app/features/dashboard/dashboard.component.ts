import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatToolbarModule, RouterModule],
  template: `
    <mat-toolbar color="primary">
      <span>Team Task Manager</span>
      <button mat-button routerLink="/dashboard">Dashboard</button>
      <button mat-button routerLink="/dashboard/teams">Teams</button>
      <span class="spacer"></span>
      <span>Welcome, {{ (authService.currentUser$ | async)?.name }}</span>
      <button mat-icon-button (click)="authService.logout()">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    .container { padding: 20px; }
  `]
})
export class DashboardComponent {
  constructor(public authService: AuthService) {}
}
