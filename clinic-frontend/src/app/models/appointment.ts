import { User } from '../services/clinic.service';

export interface Appointment {
  id: number;
  user: User;
  date: string; // ISO date
  time: string; // HH:mm
  doctor: string;
  doctorName?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}
