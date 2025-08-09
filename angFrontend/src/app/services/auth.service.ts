// file: auth.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError, of } from 'rxjs'; // ✅ Added imports

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/api/auth';
  private readonly userUrl = 'http://localhost:3000/api/user'; // ✅ Base for user routes

  isLoggedIn = signal<boolean>(false);
  user = signal<any>(null);

  constructor(private http: HttpClient, private router: Router) {}

  // Register new user
  register(data: { name: string; email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/register`, data, {
      withCredentials: true,
    });
  }

  // Login: token will be set by server as HttpOnly cookie
  login(credentials: { email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/login`, credentials, {
      withCredentials: true,
    });
  }

  // Logout: clears backend-side token (blacklists it)
  logout() {
    this.http
      .post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          this.isLoggedIn.set(false);
          this.user.set(null);
          this.router.navigate(['/login']);
        },
        error: () => {
          this.isLoggedIn.set(false);
          this.user.set(null);
          this.router.navigate(['/login']);
        },
      });
  }

  // Fetch user info from token
  fetchUser() {
    return this.http.get(`${this.userUrl}/me`, {
      withCredentials: true,
    });
  }

  // ✅ New session check for guards
  checkSession() {
    return this.http
      .get<any>('http://localhost:3000/api/user/me', { withCredentials: true })
      .pipe(
        map((user) => !!user && !!user.email), // returns true if user object exists and has email
        catchError(() => of(false)) // returns false on error like 401
      );
  }
}

// //file: auth.service.ts
// import { Injectable, signal } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private readonly apiUrl = 'http://localhost:3000/api/auth';

//   isLoggedIn = signal<boolean>(false);
//   user = signal<any>(null);

//   constructor(private http: HttpClient, private router: Router) {}

//   // Register new user
//   register(data: { name: string; email: string; password: string }) {
//     return this.http.post(`${this.apiUrl}/register`, data, {
//       withCredentials: true,
//     });
//   }

//   // Login: token will be set by server as HttpOnly cookie
//   login(credentials: { email: string; password: string }) {
//     return this.http.post(`${this.apiUrl}/login`, credentials, {
//       withCredentials: true,
//     });
//   }

//   // Logout: clears backend-side token (blacklists it)
//   logout() {
//     this.http
//       .post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
//       .subscribe({
//         next: () => {
//           this.isLoggedIn.set(false);
//           this.user.set(null);
//           this.router.navigate(['/login']);
//         },
//         error: () => {
//           this.isLoggedIn.set(false);
//           this.user.set(null);
//           this.router.navigate(['/login']);
//         },
//       });
//   }

//   // Fetch user info from token
//   fetchUser() {
//     return this.http.get('http://localhost:3000/api/user/me', {
//       withCredentials: true,
//     });
//   }

//   checkSession() {
//     return this.http.get('/api/user/me', { withCredentials: true }).pipe(
//       map((res: any) => !!res?.email), // or however you confirm login
//       catchError(() => of(false))
//     );
//   }
// }
