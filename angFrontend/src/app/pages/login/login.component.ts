//file: login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  // onSubmit() {
  //   this.authService
  //     .login({ email: this.email, password: this.password })
  //     .subscribe({
  //       next: (res) => {
  //         this.authService.handleLogin(res.token);
  //         this.authService
  //           .fetchUser()
  //           .subscribe((user) => this.authService.user.set(user));
  //         this.router.navigate(['/dashboard']); // redirect after login
  //       },
  //       error: (err) => {
  //         this.error = err.error?.message || 'Login failed';
  //       },
  //     });
  // }
  onSubmit() {
    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.authService.fetchUser().subscribe((user) => {
            this.authService.user.set(user);
            this.authService.isLoggedIn.set(true);
            this.router.navigate(['/dashboard']);
          });
        },
        error: (err) => {
          this.error = err.error?.message || 'Login failed';
        },
      });
  }
}
