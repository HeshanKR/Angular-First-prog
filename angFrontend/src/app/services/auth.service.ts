//file: auth.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/api/auth';
  private readonly tokenKey = 'auth_token';

  // Signals (you can use Observables if preferred)
  isLoggedIn = signal<boolean>(this.hasToken());
  user = signal<any>(null);

  constructor(private http: HttpClient, private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // Register new user
  register(data: { name: string; email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // Login and save token
  login(credentials: { email: string; password: string }) {
    return this.http.post<{ token: string }>(
      `${this.apiUrl}/login`,
      credentials
    );
  }

  // Save token and update login state
  handleLogin(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.isLoggedIn.set(true);
  }

  // Logout
  logout() {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedIn.set(false);
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Load current user from /me
  fetchUser() {
    return this.http.get('http://localhost:3000/api/user/me');
  }
}
