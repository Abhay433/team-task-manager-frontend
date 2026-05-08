import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Task } from '../../../core/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly API_URL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  createTask(projectId: number, taskData: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(`${this.API_URL}/projects/${projectId}/tasks`, taskData);
  }

  getTasks(projectId: number, filters?: any): Observable<Task[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.assignedToId) params = params.set('assignedToId', filters.assignedToId.toString());
    }
    return this.http.get<Task[]>(`${this.API_URL}/projects/${projectId}/tasks`, { params });
  }

  updateTaskStatus(taskId: number, status: string): Observable<Task> {
    return this.http.patch<Task>(`${this.API_URL}/tasks/${taskId}/status`, { status });
  }
}
