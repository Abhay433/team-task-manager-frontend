import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Dashboard</h1>
    <p>Welcome to your task manager! Use the navigation above to manage your teams and tasks.</p>
  `
})
export class HomeComponent {}
