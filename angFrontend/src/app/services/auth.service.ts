// angFrontend/src/app/services/auth.service.ts

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/api/auth';
  private readonly userUrl = 'http://localhost:3000/api/user';

  isLoggedIn = signal<boolean>(false);
  user = signal<any>(null);

  constructor(private http: HttpClient, private router: Router) {}

  // Register
  register(data: { name: string; email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/register`, data, {
      withCredentials: true,
    });
  }

  // Login
  login(credentials: { email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/login`, credentials, {
      withCredentials: true,
    });
  }

  // Logout
  logout() {
    this.http
      .post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => this.clearSession(),
        error: () => this.clearSession(),
      });
  }

  private clearSession() {
    this.isLoggedIn.set(false);
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  // Fetch user info
  // fetchUser() {
  //   return this.http.get(`${this.userUrl}/me`, { withCredentials: true }).pipe(
  //     tap((user: any) => {
  //       this.user.set(user);
  //       this.isLoggedIn.set(!!user);
  //     }),
  //     catchError(() => {
  //       this.user.set(null);
  //       this.isLoggedIn.set(false);
  //       return of(null);
  //     })
  //   );
  // }

  fetchUser() {
    return this.http.get(`${this.userUrl}/me`, { withCredentials: true }).pipe(
      tap((user: any) => {
        if (user) {
          this.user.set(user);
          this.isLoggedIn.set(true);
        } else {
          this.user.set(null);
          this.isLoggedIn.set(false);
        }
      }),
      catchError(() => {
        this.user.set(null);
        this.isLoggedIn.set(false);
        return of(null);
      })
    );
  }

  // Refresh access token
  refreshToken() {
    return this.http
      .post(`${this.apiUrl}/refresh-token`, {}, { withCredentials: true })
      .pipe(
        tap(() => console.log('✅ Access token refreshed')),
        catchError((err) => {
          console.error('❌ Refresh token failed', err);
          this.logout();
          return throwError(() => err);
        })
      );
  }

  // Check session for guards
  checkSession() {
    return this.fetchUser().pipe(
      map((user) => !!user && !!user.id),
      catchError(() => of(false))
    );
  }
}
