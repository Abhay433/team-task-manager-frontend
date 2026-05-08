import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { TeamService } from '../services/team.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ProjectService } from '../../projects/services/project.service';
import { Team, TeamMember } from '../../../core/models/team.model';
import { Project } from '../../../core/models/project.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="sidebar">
        <mat-card class="team-list-card">
          <mat-card-header>
            <mat-card-title>My Teams</mat-card-title>
          </mat-card-header>
          <mat-list>
            <mat-list-item *ngFor="let team of userTeams" 
                          [class.active]="currentTeam?.id === team.id"
                          (click)="selectTeam(team)">
              <mat-icon matListItemIcon>groups</mat-icon>
              <div matListItemTitle>{{ team.name }}</div>
              <div matListItemLine>{{ team.memberCount }} members, {{ team.projectCount }} projects</div>
            </mat-list-item>
            <mat-list-item *ngIf="userTeams.length === 0">
              No teams found.
            </mat-list-item>
          </mat-list>
          <mat-card-actions>
            <button mat-button color="primary" (click)="currentTeam = null; projects = []; members = []">
              <mat-icon>add</mat-icon> New Team
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="main-content">
        <mat-card *ngIf="!currentTeam" class="create-team-card">
          <mat-card-header>
            <mat-card-title>Create New Team</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="teamForm" (ngSubmit)="onCreateTeam()">
              <mat-form-field appearance="outline">
                <mat-label>Team Name</mat-label>
                <input matInput formControlName="name" placeholder="Enter team name">
                <mat-error *ngIf="teamForm.get('name')?.hasError('required')">Name is required</mat-error>
              </mat-form-field>
              <button mat-raised-button color="primary" type="submit" [disabled]="teamForm.invalid">
                Create Team
              </button>
            </form>
          </mat-card-content>
        </mat-card>

        <div *ngIf="currentTeam" class="team-workspace">
          <div class="workspace-header">
            <h1>{{ currentTeam.name }}</h1>
            <span class="badge">Team ID: {{ currentTeam.id }}</span>
          </div>

          <div class="workspace-grid">
            <mat-card class="members-card">
              <mat-card-header>
                <mat-card-title>Members</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <mat-list>
                  <mat-list-item *ngFor="let member of members">
                    <mat-icon matListItemIcon>person</mat-icon>
                    <div matListItemTitle>{{ member.name }}</div>
                    <div matListItemLine>{{ member.email }} ({{ member.role }})</div>
                  </mat-list-item>
                </mat-list>

                <form [formGroup]="memberForm" (ngSubmit)="onAddMember()" class="add-member-form">
                  <mat-form-field appearance="outline">
                    <mat-label>Select User</mat-label>
                    <mat-select formControlName="userId">
                      <mat-option *ngFor="let user of allUsers" [value]="user.id">
                        {{ user.name }} ({{ user.email }})
                      </mat-option>
                    </mat-select>
                  </mat-form-field>
                  <button mat-mini-fab color="accent" type="submit" [disabled]="memberForm.invalid">
                    <mat-icon>add</mat-icon>
                  </button>
                </form>
              </mat-card-content>
            </mat-card>

            <mat-card class="projects-card">
              <mat-card-header>
                <mat-card-title>Projects</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <mat-list>
                  <mat-list-item *ngFor="let project of projects" [routerLink]="['/dashboard/projects', project.id]" class="project-item">
                    <mat-icon matListItemIcon>assignment</mat-icon>
                    <div matListItemTitle>{{ project.name }}</div>
                    <div matListItemLine>{{ project.description }} ({{ project.status }})</div>
                  </mat-list-item>
                  <mat-list-item *ngIf="projects.length === 0">
                    No projects yet.
                  </mat-list-item>
                </mat-list>

                <form [formGroup]="projectForm" (ngSubmit)="onCreateProject()" class="add-project-form">
                  <mat-form-field appearance="outline">
                    <mat-label>Project Name</mat-label>
                    <input matInput formControlName="name" placeholder="Enter project name">
                  </mat-form-field>
                  <button mat-raised-button color="accent" type="submit" [disabled]="projectForm.invalid">
                    Add Project
                  </button>
                </form>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: grid;
      grid-template-columns: 300px 1fr;
      height: calc(100vh - 64px);
      background: #f5f7fa;
    }
    .sidebar {
      padding: 20px;
      border-right: 1px solid #e0e0e0;
      background: white;
      overflow-y: auto;
    }
    .main-content {
      padding: 30px;
      overflow-y: auto;
    }
    .team-list-card {
      box-shadow: none !important;
    }
    .mat-mdc-list-item {
      cursor: pointer;
      border-radius: 8px;
      margin-bottom: 5px;
      transition: background 0.2s;
    }
    .mat-mdc-list-item:hover {
      background: #f0f4ff;
    }
    .mat-mdc-list-item.active {
      background: #e8efff;
      color: #3f51b5;
    }
    .workspace-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    .badge {
      background: #3f51b5;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
    }
    .workspace-grid {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 25px;
    }
    .add-member-form, .add-project-form {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-top: 20px;
    }
    .project-item {
      cursor: pointer;
      border-radius: 8px;
      transition: background 0.2s;
    }
    .project-item:hover {
      background: #f0f4ff;
    }
    mat-card {
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05) !important;
    }
  `]
})
export class TeamManagementComponent implements OnInit {
  constructor(
    private teamService: TeamService,
    private projectService: ProjectService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  teamForm!: FormGroup;
  memberForm!: FormGroup;
  projectForm!: FormGroup;
  currentTeam: Team | null = null;
  members: TeamMember[] = [];
  projects: Project[] = [];
  allUsers: User[] = [];
  userTeams: Team[] = [];

  ngOnInit() {
    this.teamForm = this.fb.group({
      name: ['', Validators.required]
    });
    this.memberForm = this.fb.group({
      userId: ['', [Validators.required]]
    });
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      status: ['planning']
    });
    this.loadAllUsers();
    this.loadUserTeams();
  }

  loadUserTeams() {
    this.teamService.getMyTeams().subscribe({
      next: (teams) => this.userTeams = teams,
      error: (err) => console.error('Error loading teams', err)
    });
  }

  selectTeam(team: Team) {
    this.currentTeam = team;
    this.loadMembers(team.id);
    this.loadProjects(team.id);
  }

  onCreateTeam() {
    if (this.teamForm.valid) {
      this.teamService.createTeam(this.teamForm.value.name).subscribe({
        next: (team) => {
          this.currentTeam = team;
          this.snackBar.open('Team created successfully!', 'Close', { duration: 3000 });
          this.loadUserTeams(); // Refresh list
          this.loadMembers(team.id);
          this.loadProjects(team.id);
          this.teamForm.reset();
        },
        error: (err) => this.snackBar.open(err.error?.message || 'Error creating team', 'Close', { duration: 3000 })
      });
    }
  }

  onAddMember() {
    if (this.currentTeam && this.memberForm.valid) {
      this.teamService.addMember(this.currentTeam.id, this.memberForm.value.userId).subscribe({
        next: () => {
          this.snackBar.open('Member added successfully!', 'Close', { duration: 3000 });
          this.loadMembers(this.currentTeam!.id);
          this.memberForm.reset();
        },
        error: (err) => this.snackBar.open(err.error?.message || 'Error adding member', 'Close', { duration: 3000 })
      });
    }
  }

  onCreateProject() {
    if (this.currentTeam && this.projectForm.valid) {
      this.projectService.createProject(this.currentTeam.id, this.projectForm.value).subscribe({
        next: () => {
          this.snackBar.open('Project created successfully!', 'Close', { duration: 3000 });
          this.loadProjects(this.currentTeam!.id);
          this.projectForm.reset({ status: 'planning' });
        },
        error: (err) => this.snackBar.open(err.error?.message || 'Error creating project', 'Close', { duration: 3000 })
      });
    }
  }

  private loadMembers(teamId: number) {
    this.teamService.getMembers(teamId).subscribe({
      next: (members) => this.members = members,
      error: (err) => console.error('Error loading members', err)
    });
  }

  private loadProjects(teamId: number) {
    this.projectService.getProjects(teamId).subscribe({
      next: (projects) => this.projects = projects,
      error: (err) => console.error('Error loading projects', err)
    });
  }
  private loadAllUsers() {
    this.authService.getUsers().subscribe({
      next: (users) => this.allUsers = users,
      error: (err) => console.error('Error loading users', err)
    });
  }
}
