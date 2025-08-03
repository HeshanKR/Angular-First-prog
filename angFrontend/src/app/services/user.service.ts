import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  private backendUrl = 'http://localhost:3000'; // Your Express backend

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get(`${this.backendUrl}/users`);
  }
}
