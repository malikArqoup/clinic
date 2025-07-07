import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Appointment } from '../models/appointment';

export interface SliderImage {
  id: string;
  image?: string;
  image_url: string;
  title: string;
  text: string;
  order: number;
  isActive: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  age: number;
  gender: string;
  role: 'admin' | 'patient';
  status?: 'active' | 'inactive';
  avatar?: string;
  created_at?: string;
}

export interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  newPatients: number;
  revenue: number;
  pendingAppointments: number;
  confirmedAppointments: number;
}

export interface BookingCreate {
  date: string;
  start_time: string;
  end_time: string;
}

export interface BookingOut {
  id: number;
  user_id: number;
  user?: {
    id: number;
    name: string;
    email: string;
    phone_number: string;
  };
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  created_at: string;
}

export interface AvailabilityOut {
  id: number;
  weekday: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClinicService {
  private apiUrl = 'http://localhost:8000'; // FastAPI default port

  constructor(private http: HttpClient) {}

  // Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Authentication
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  adminLogin(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin-login`, { email, password });
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`, { headers: this.getAuthHeaders() });
  }

  // Appointments Management
  getAppointments(): Observable<BookingOut[]> {
    return this.http.get<BookingOut[]>(`${this.apiUrl}/admin/bookings`, { 
      headers: this.getAuthHeaders() 
    });
  }

  createAppointment(booking: BookingCreate): Observable<BookingOut> {
    return this.http.post<BookingOut>(`${this.apiUrl}/bookings/`, booking, {
      headers: this.getAuthHeaders()
    });
  }

  updateAppointment(id: number, updates: Partial<BookingOut>): Observable<BookingOut> {
    return this.http.put<BookingOut>(`${this.apiUrl}/admin/bookings/${id}`, updates, { 
      headers: this.getAuthHeaders() 
    });
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/bookings/${id}`, { 
      headers: this.getAuthHeaders() 
    });
  }

  confirmAppointment(id: number): Observable<BookingOut> {
    return this.http.patch<BookingOut>(`${this.apiUrl}/admin/bookings/${id}/status`, 
      { status: 'confirmed' }, 
      { headers: this.getAuthHeaders() }
    );
  }

  cancelAppointment(id: number): Observable<BookingOut> {
    return this.http.patch<BookingOut>(`${this.apiUrl}/admin/bookings/${id}/status`, 
      { status: 'cancelled' }, 
      { headers: this.getAuthHeaders() }
    );
  }

  completeAppointment(id: number): Observable<BookingOut> {
    return this.http.patch<BookingOut>(`${this.apiUrl}/admin/bookings/${id}/status`, 
      { status: 'completed' }, 
      { headers: this.getAuthHeaders() }
    );
  }

  // User Management
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users`, { 
      headers: this.getAuthHeaders() 
    });
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/admin/users`, user, { 
      headers: this.getAuthHeaders() 
    });
  }

  updateUser(id: number, updates: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/admin/users/${id}`, updates, { 
      headers: this.getAuthHeaders() 
    });
  }

  deleteUser(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/admin/users/${id}`, { 
      headers: this.getAuthHeaders() 
    });
  }

  // Availability Management
  getAvailability(): Observable<AvailabilityOut[]> {
    return this.http.get<AvailabilityOut[]>(`${this.apiUrl}/availability/`);
  }

  createAvailability(availability: any): Observable<AvailabilityOut> {
    return this.http.post<AvailabilityOut>(`${this.apiUrl}/availability/`, availability, { 
      headers: this.getAuthHeaders() 
    });
  }

  deleteAvailability(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/availability/${id}`, { 
      headers: this.getAuthHeaders() 
    });
  }

  // Public endpoints (no auth required)
  getAvailableSlots(date: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bookings/available-slots/${date}`, { 
      headers: this.getAuthHeaders() 
    });
  }

  getAvailableSlotsPublic(date: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bookings/available-slots-public/${date}`);
  }

  // Dashboard Stats
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/admin/dashboard/stats`, { 
      headers: this.getAuthHeaders() 
    });
  }

  // Search endpoints
  searchAppointments(query: string): Observable<BookingOut[]> {
    return this.http.get<BookingOut[]>(`${this.apiUrl}/admin/bookings/search?q=${query}`, { 
      headers: this.getAuthHeaders() 
    });
  }

  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users/search?q=${query}`, { 
      headers: this.getAuthHeaders() 
    });
  }

  // Slider Management
  getSliderImages(): Observable<SliderImage[]> {
    return this.http.get<SliderImage[]>(`${this.apiUrl}/admin/slider-images`, {
      headers: this.getAuthHeaders()
    });
  }

  getSliderImagesPublic(): Observable<SliderImage[]> {
    return this.http.get<SliderImage[]>(`${this.apiUrl}/slider/images`);
  }

  addSliderImage(formData: FormData): Observable<SliderImage> {
    return this.http.post<SliderImage>(`${this.apiUrl}/admin/slider-images`, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      })
    });
  }

  updateSliderImage(id: string, updates: FormData): Observable<SliderImage> {
    return this.http.put<SliderImage>(`${this.apiUrl}/admin/slider-images/${id}`, updates, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      })
    });
  }

  deleteSliderImage(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/admin/slider-images/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Legacy methods for compatibility (will be removed)
  getAppointmentsByDate(date: string): Observable<BookingOut[]> {
    return this.http.get<BookingOut[]>(`${this.apiUrl}/admin/bookings?date=${date}`, { 
      headers: this.getAuthHeaders() 
    });
  }

  getAppointmentsByStatus(status: string): Observable<BookingOut[]> {
    return this.http.get<BookingOut[]>(`${this.apiUrl}/admin/bookings?status=${status}`, { 
      headers: this.getAuthHeaders() 
    });
  }

  getUpcomingAppointments(): Observable<BookingOut[]> {
    return this.http.get<BookingOut[]>(`${this.apiUrl}/admin/bookings?upcoming=true`, { 
      headers: this.getAuthHeaders() 
    });
  }

  getPendingAppointments(): Observable<BookingOut[]> {
    return this.getAppointmentsByStatus('booked');
  }

  saveBookingSettings(settings: any) {
    return this.http.post(`${this.apiUrl}/admin/booking-settings`, settings, {
      headers: this.getAuthHeaders()
    });
  }

}
