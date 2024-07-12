import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, UserSignin, UserSignup } from '../models/user.model';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public user$: Observable<any> = this.userSubject.asObservable();
  apiUrl = environment.baseUrl;

  constructor(private router: Router, private http: HttpClient) {}

  public get userValue(): any {
    return this.userSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return this.http.post<any>(`${this.apiUrl}/auth/signin`, formData).pipe(
      tap((response) => {
        if (response && response.access_token && response.name) {
          localStorage.setItem('authToken', response.access_token);
          localStorage.setItem('name', response.name);
          localStorage.setItem('id', response.id);
          localStorage.setItem('type', response.type);
          this.userSubject.next(response);
        }
      })
    );
  }

  register(user: UserSignup): Observable<any> {
    return this.http.post<User>(`${this.apiUrl}/auth/signup`, user);
  }

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('name');
    localStorage.removeItem('id');
    localStorage.removeItem('type');
    this.router.navigate(['/signin']);
  }
}

export const isLoggedIn = () => {
  return !!localStorage.getItem('authToken') && !!localStorage.getItem('name');
};

export function getUserType(): string | null {
  return localStorage.getItem('type');
}

export const loggedName = () => {
  return localStorage.getItem('name');
};
