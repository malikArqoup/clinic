import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Appointment } from '../models/appointment';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class ClinicService {
  private appointments: Appointment[] = [
    { id: '1', name: 'John Doe', phone: '123456789', serviceType: 'General Medicine', dateTime: '2024-07-10T10:00' },
    { id: '2', name: 'Jane Smith', phone: '987654321', serviceType: 'Dental', dateTime: '2024-07-11T14:30' },
  ];

  getAppointments(): Observable<Appointment[]> {
    return of(this.appointments);
  }

  addAppointment(appointment: Appointment): Observable<Appointment> {
    this.appointments.push({ ...appointment, id: Date.now().toString() });
    return of(appointment);
  }

  updateAppointment(id: string, data: Partial<Appointment>): Observable<Appointment | undefined> {
    const idx = this.appointments.findIndex(a => a.id === id);
    if (idx > -1) {
      this.appointments[idx] = { ...this.appointments[idx], ...data };
      return of(this.appointments[idx]);
    }
    return of(undefined);
  }

  deleteAppointment(id: string): Observable<boolean> {
    const idx = this.appointments.findIndex(a => a.id === id);
    if (idx > -1) {
      this.appointments.splice(idx, 1);
      return of(true);
    }
    return of(false);
  }

  login(email: string, password: string): Observable<User | null> {
    // Mock: admin@clinic.com / password
    if (email === 'admin@clinic.com' && password === 'password') {
      return of({ id: 'admin', name: 'Admin', email });
    }
    return of(null);
  }

  register(user: User): Observable<User> {
    // Mock registration
    return of({ ...user, id: Date.now().toString() });
  }
} 