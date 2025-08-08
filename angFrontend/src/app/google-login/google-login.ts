import { Component } from '@angular/core';

@Component({
  selector: 'app-google-login',
  imports: [],
  templateUrl: './google-login.html',
  styleUrl: './google-login.css',
})
export class GoogleLogin {
  loginWithGoogle() {
    // This will redirect user to Google OAuth through backend
    window.location.href = 'http://localhost:3000/api/auth/google';
  }
}
