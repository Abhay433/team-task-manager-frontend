import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Team, TeamMember } from '../../../core/models/team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly API_URL = `${environment.apiUrl}/teams`;

  constructor(private http: HttpClient) { }

  createTeam(name: string): Observable<Team> {
    return this.http.post<Team>(`${this.API_URL}/createTeam`, { name });
  }

  addMember(teamId: number, userId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${teamId}/addMembers`, { userId });
  }

  getMembers(teamId: number): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(`${this.API_URL}/${teamId}/getMembers`);
  }

  getMyTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.API_URL}/myTeams`);
  }
}
