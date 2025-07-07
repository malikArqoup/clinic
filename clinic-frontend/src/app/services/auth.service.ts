import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClinicService } from './clinic.service';

export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  age: number;
  gender: string;
  role: 'admin' | 'patient';
  access_token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private clinicService: ClinicService
  ) {
    // Check if user is already logged in
    this.checkStoredUser();
  }

  private checkStoredUser() {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.logout();
      }
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.clinicService.login(email, password).pipe(
      map((response: any) => {
        const user: User = {
          id: response.id,
          name: response.name,
          email: response.email,
          phone_number: response.phone_number,
          age: response.age,
          gender: response.gender,
          role: response.role
        };

        // Store token and user data
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  adminLogin(email: string, password: string): Observable<User> {
    return this.clinicService.adminLogin(email, password).pipe(
      map((response: any) => {
        const user: User = {
          id: response.id,
          name: response.name,
          email: response.email,
          phone_number: response.phone_number,
          age: response.age,
          gender: response.gender,
          role: response.role
        };

        // Store token and user data
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  register(userData: any): Observable<User> {
    return this.clinicService.register(userData).pipe(
      map((response: any) => {
        const user: User = {
          id: response.id,
          name: response.name,
          email: response.email,
          phone_number: response.phone_number,
          age: response.age,
          gender: response.gender,
          role: response.role
        };

        // Store token and user data
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  isPatient(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'patient';
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  refreshUserData(): Observable<User> {
    return this.clinicService.getCurrentUser().pipe(
      map((response: any) => {
        const user: User = {
          id: response.id,
          name: response.name,
          email: response.email,
          phone_number: response.phone_number,
          age: response.age,
          gender: response.gender,
          role: response.role
        };

        localStorage.setItem('user_data', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }
} 