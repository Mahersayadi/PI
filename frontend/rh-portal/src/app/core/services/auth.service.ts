import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AppConfig } from '../../utils/app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // API Gateway endpoint
  private baseUrl = AppConfig.endpoints.AUTH;

  constructor(private http: HttpClient) {}

  // ================================
  // 🔹 LOGIN
  // ================================
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response?.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify({
            id: response.id,
            name: response.name,
            email: response.email,
            role: response.role
          }));
        }
      })
    );
  }

  // ================================
  // 🔹 REGISTER
  // ================================
  register(user: { name: string; email: string; password: string; role?: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  // ================================
  // 🔹 SAVE / GET USER
  // ================================
  saveUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // ================================
  // 🔹 TOKEN MANAGEMENT
  // ================================
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ================================
  // 🔹 LOGOUT
  // ================================
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // ================================
  // 🔹 GET ROLE
  // ================================
  getUserRole(): string | null {
    const user = this.getUser();
    return user?.role || null;
  }

  // ================================
  // 🔹 IS ADMIN / IS EMPLOYEE
  // ================================
  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isEmployee(): boolean {
    return this.getUserRole() === 'EMPLOYEE';
  }

  isRhManager(): boolean {
    return this.getUserRole() === 'RH_MANAGER';
  }

  isCandidate(): boolean {
    return this.getUserRole() === 'CANDIDATE';
  }

  getUserId(): number | null {
    return this.getUser()?.id || null;
  }

  // ================================
  // 🔹 PASSWORD RESET
  // ================================
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, { token, newPassword });
  }
}
