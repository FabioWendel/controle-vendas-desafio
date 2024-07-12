import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { User, UserSignup, UserUpdate } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  register(user: UserSignup): Observable<any> {
    return this.http.post<User>(`${this.apiUrl}/auth/signup`, user);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/auth/users`);
  }

  updateUser(userId: number, user: Partial<UserUpdate>): Observable<any> {
    return this.http.put<UserUpdate>(
      `${this.apiUrl}/auth/users/${userId}`,
      user
    );
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/auth/users/${userId}`);
  }
}
