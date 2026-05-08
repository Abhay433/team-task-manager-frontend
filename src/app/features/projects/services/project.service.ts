import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Project } from '../../../core/models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly API_URL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  createProject(teamId: number, projectData: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(`${this.API_URL}/teams/${teamId}/projects`, projectData);
  }

  getProjects(teamId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.API_URL}/teams/${teamId}/projects`);
  }

  updateProject(projectId: number, projectData: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.API_URL}/projects/${projectId}`, projectData);
  }

  getProjectDetails(projectId: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/projects/${projectId}`);
  }

  deleteProject(projectId: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/projects/${projectId}`);
  }
}
