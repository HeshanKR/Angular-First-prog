//file: role-edtior.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-editor.html',
  styleUrls: ['./role-editor.css'],
})
export class RoleEditor {
  userId = '';
  newRole = 'user';
  message = '';
  error = '';

  constructor(private http: HttpClient) {}

  submitRoleUpdate() {
    this.message = '';
    this.error = '';

    this.http
      .patch(
        `http://localhost:3000/api/user/${this.userId}/role`,
        { role: this.newRole },
        { withCredentials: true }
      )
      .subscribe({
        next: (res: any) => {
          this.message = res.message;
        },
        error: (err) => {
          this.error = err.error?.message || 'Something went wrong';
        },
      });
  }
}
