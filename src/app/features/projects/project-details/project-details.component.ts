import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProjectService } from '../services/project.service';
import { TaskService } from '../services/task.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  template: `
    <div class="details-container" *ngIf="project">
      <div class="header">
        <button mat-icon-button routerLink="/dashboard/teams">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Project Details</h1>
        <div class="header-actions" *ngIf="canDelete()">
          <button mat-flat-button color="warn" (click)="onDeleteProject()">
            <mat-icon>delete</mat-icon> Delete Project
          </button>
        </div>
      </div>

      <div class="grid">
        <div class="left-col">
          <mat-card class="info-card">
            <mat-card-header>
              <mat-icon mat-card-avatar color="primary">assignment</mat-icon>
              <mat-card-title>{{ project.name }}</mat-card-title>
              <mat-card-subtitle>Created by {{ project.createdBy.name }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p class="description">{{ project.description || 'No description provided.' }}</p>
              <mat-chip-set>
                <mat-chip [color]="project.status === 'active' ? 'primary' : 'accent'" selected>
                  {{ project.status | titlecase }}
                </mat-chip>
              </mat-chip-set>
            </mat-card-content>
          </mat-card>

          <mat-card class="tasks-card">
            <mat-card-header>
              <mat-card-title>Tasks</mat-card-title>
              <div class="filters">
                <mat-form-field appearance="outline" subscriptSizing="dynamic">
                  <mat-select [(ngModel)]="statusFilter" (selectionChange)="loadTasks()" placeholder="Filter Status">
                    <mat-option value="">All Status</mat-option>
                    <mat-option value="todo">To Do</mat-option>
                    <mat-option value="in_progress">In Progress</mat-option>
                    <mat-option value="in_review">In Review</mat-option>
                    <mat-option value="done">Done</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </mat-card-header>
            <mat-card-content>
              <mat-list>
                <mat-list-item *ngFor="let task of tasks" class="task-item">
                  <mat-icon matListItemIcon [color]="getStatusColor(task.status)">
                    {{ getStatusIcon(task.status) }}
                  </mat-icon>
                  <div matListItemTitle>{{ task.title }}</div>
                  <div matListItemLine>
                    Assigned to: {{ task.assignedTo?.name || 'Unassigned' }} | 
                    Priority: {{ task.priority }}
                  </div>
                  <div matListItemMeta>
                    <mat-form-field appearance="outline" subscriptSizing="dynamic" class="status-select">
                      <mat-select [value]="task.status" 
                                 (selectionChange)="onStatusChange(task.id, $event.value)"
                                 [disabled]="!canUpdateStatus(task)">
                        <mat-option value="todo">To Do</mat-option>
                        <mat-option value="in_progress">In Progress</mat-option>
                        <mat-option value="in_review">In Review</mat-option>
                        <mat-option value="done">Done</mat-option>
                      </mat-select>
                    </mat-form-field>
                  </div>
                </mat-list-item>
                <mat-list-item *ngIf="tasks.length === 0">No tasks found.</mat-list-item>
              </mat-list>

              <div *ngIf="isOwner" class="create-task-section">
                <h3>Create New Task</h3>
                <form [formGroup]="taskForm" (ngSubmit)="onCreateTask()" class="task-form">
                  <mat-form-field appearance="outline">
                    <mat-label>Task Title</mat-label>
                    <input matInput formControlName="title" placeholder="What needs to be done?">
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline">
                    <mat-label>Assign To</mat-label>
                    <mat-select formControlName="assignedToId">
                      <mat-option *ngFor="let member of project.teamMembers" [value]="member.id">
                        {{ member.name }}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Priority</mat-label>
                    <mat-select formControlName="priority">
                      <mat-option value="low">Low</mat-option>
                      <mat-option value="medium">Medium</mat-option>
                      <mat-option value="high">High</mat-option>
                      <mat-option value="urgent">Urgent</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <button mat-raised-button color="primary" type="submit" [disabled]="taskForm.invalid">
                    Create Task
                  </button>
                </form>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="right-col">
          <mat-card class="members-card">
            <mat-card-header>
              <mat-card-title>Team Members</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <mat-list>
                <mat-list-item *ngFor="let member of project.teamMembers">
                  <mat-icon matListItemIcon>person</mat-icon>
                  <div matListItemTitle>{{ member.name }}</div>
                  <div matListItemLine>{{ member.email }}</div>
                  <div matListItemMeta>
                    <mat-chip [class.owner-chip]="member.role === 'owner'">{{ member.role }}</mat-chip>
                  </div>
                </mat-list-item>
              </mat-list>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .details-container {
      padding: 30px;
      max-width: 1000px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 30px;
    }
    .header-actions {
      margin-left: auto;
    }
    .header h1 {
      margin: 0;
      font-size: 1.8rem;
    }
    .grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 25px;
    }
    .left-col {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }
    .tasks-card {
      padding-bottom: 20px;
    }
    .filters {
      margin-left: auto;
    }
    .filters mat-form-field {
      width: 150px;
    }
    .task-item {
      border-bottom: 1px solid #f0f0f0;
    }
    .status-select {
      width: 130px;
    }
    .create-task-section {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px dashed #eee;
    }
    .task-form {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr auto;
      gap: 15px;
      align-items: center;
    }
    .info-card .description {
      font-size: 1.1rem;
      color: #555;
      margin: 20px 0;
      line-height: 1.6;
    }
    .owner-chip {
      background: #e8f5e9;
      color: #2e7d32;
    }
    mat-card {
      border-radius: 16px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.08) !important;
    }
  `]
})
export class ProjectDetailsComponent implements OnInit {
  project: any;
  tasks: Task[] = [];
  taskForm!: FormGroup;
  statusFilter: string = '';
  isOwner: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private taskService: TaskService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const projectId = this.route.snapshot.params['projectId'];
    if (projectId) {
      this.loadProjectDetails(projectId);
      this.initForm();
    }
  }

  initForm() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      assignedToId: [null],
      priority: ['medium']
    });
  }

  loadProjectDetails(projectId: number) {
    this.projectService.getProjectDetails(projectId).subscribe({
      next: (data) => {
        this.project = data;
        this.checkOwnership();
        this.loadTasks();
      },
      error: (err) => this.snackBar.open('Error loading project', 'Close')
    });
  }

  loadTasks() {
    const projectId = this.project.id;
    const filters = this.statusFilter ? { status: this.statusFilter } : {};
    this.taskService.getTasks(projectId, filters).subscribe({
      next: (tasks) => this.tasks = tasks,
      error: (err) => console.error('Error loading tasks', err)
    });
  }

  checkOwnership() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && this.project) {
      const userInTeam = this.project.teamMembers.find((m: any) => m.id === currentUser.id);
      this.isOwner = userInTeam?.role === 'owner';
    }
  }

  onCreateTask() {
    if (this.taskForm.valid && this.project) {
      this.taskService.createTask(this.project.id, this.taskForm.value).subscribe({
        next: () => {
          this.snackBar.open('Task created successfully!', 'Close', { duration: 3000 });
          this.taskForm.reset({ priority: 'medium' });
          this.loadTasks();
        },
        error: (err) => this.snackBar.open(err.error?.message || 'Error creating task', 'Close')
      });
    }
  }

  onStatusChange(taskId: number, newStatus: string) {
    this.taskService.updateTaskStatus(taskId, newStatus).subscribe({
      next: () => {
        this.snackBar.open('Status updated', 'Close', { duration: 2000 });
        this.loadTasks();
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Update failed', 'Close')
    });
  }

  canUpdateStatus(task: Task): boolean {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return false;
    return this.isOwner || task.assignedToId === currentUser.id;
  }

  canDelete(): boolean {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser || !this.project) return false;
    return this.isOwner || this.project.createdById === currentUser.id;
  }

  onDeleteProject() {
    if (confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
      this.projectService.deleteProject(this.project.id).subscribe({
        next: () => {
          this.snackBar.open('Project deleted successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard/teams']); // Navigate back to teams
        },
        error: (err) => this.snackBar.open(err.error?.message || 'Delete failed', 'Close')
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'done': return 'primary';
      case 'in_progress': return 'accent';
      case 'in_review': return 'warn';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'done': return 'check_circle';
      case 'in_progress': return 'play_circle';
      case 'in_review': return 'visibility';
      default: return 'radio_button_unchecked';
    }
  }
}
