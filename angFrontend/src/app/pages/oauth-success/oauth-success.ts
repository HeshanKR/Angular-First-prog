import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-oauth-success',
  templateUrl: './oauth-success.html',
  styleUrls: ['./oauth-success.css'],
  imports: [],
})
export class OauthSuccess implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Call backend to verify cookie & fetch user
    this.authService.fetchUser().subscribe({
      next: (user) => {
        if (user) {
          // ✅ Only navigate once we actually have a user
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: () => {
        this.router.navigate(['/login']);
      },
    });
  }
}
