import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environment/environment';
import { User, AuthResponse } from '../../core/models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly API_URL = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => this.handleAuthentication(response))
    );
  }

  signup(userData: any): Observable<AuthResponse> {
    const payload = {
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'member'
    };
    return this.http.post<AuthResponse>(`${this.API_URL}/signup`, payload).pipe(
      tap(response => this.handleAuthentication(response))
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  private handleAuthentication(response: AuthResponse) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }
}
