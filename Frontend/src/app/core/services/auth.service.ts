import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, AuthResponse, RegisterRequest } from '../models/auth.model';
import { User } from '../models/user.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);

  private readonly API_URL = 'http://localhost:5113/api/Auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  // Signals for state management
  readonly token = signal<string | null>(this.storage.getItem(this.TOKEN_KEY));
  readonly currentUser = signal<User | null>(
    (() => {
      const userStr = this.storage.getItem(this.USER_KEY);
      try {
        return userStr ? JSON.parse(userStr) : null;
      } catch {
        return null;
      }
    })()
  );

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, request).pipe(
      tap(res => {
        this.storage.setItem(this.TOKEN_KEY, res.token);
        this.token.set(res.token);

        const user: User = {
          email: res.email,
          firstName: res.firstName,
          lastName: res.lastName,
          fullName: `${res.firstName} ${res.lastName}`
        };

        this.storage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUser.set(user);
      })
    );
  }

  register(request: RegisterRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, request);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/reset-password`, { token, password });
  }

  logout(): void {
    this.storage.removeItem(this.TOKEN_KEY);
    this.storage.removeItem(this.USER_KEY);
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.token();
  }
}