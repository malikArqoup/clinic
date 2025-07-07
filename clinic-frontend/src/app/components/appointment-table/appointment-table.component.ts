import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClinicService, BookingOut } from '../../services/clinic.service';

@Component({
  selector: 'app-appointment-table',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule,
    MatSnackBarModule
  ],
  template: `
    <table mat-table [dataSource]="appointments" class="mat-elevation-z8">
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef> # </th>
        <td mat-cell *matCellDef="let a"> {{a.id}} </td>
      </ng-container>
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef> الاسم </th>
        <td mat-cell *matCellDef="let a"> {{a.user?.name}} </td>
      </ng-container>
      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef> البريد الإلكتروني </th>
        <td mat-cell *matCellDef="let a"> {{a.user?.email}} </td>
      </ng-container>
      <ng-container matColumnDef="phone">
        <th mat-header-cell *matHeaderCellDef> رقم الهاتف </th>
        <td mat-cell *matCellDef="let a"> {{a.user?.phone_number}} </td>
      </ng-container>
      <ng-container matColumnDef="age">
        <th mat-header-cell *matHeaderCellDef> العمر </th>
        <td mat-cell *matCellDef="let a"> {{a.user?.age}} </td>
      </ng-container>
      <ng-container matColumnDef="gender">
        <th mat-header-cell *matHeaderCellDef> الجنس </th>
        <td mat-cell *matCellDef="let a"> {{a.user?.gender}} </td>
      </ng-container>
      <ng-container matColumnDef="role">
        <th mat-header-cell *matHeaderCellDef> الدور </th>
        <td mat-cell *matCellDef="let a"> {{a.user?.role}} </td>
      </ng-container>
      <ng-container matColumnDef="doctor">
        <th mat-header-cell *matHeaderCellDef> الطبيب </th>
        <td mat-cell *matCellDef="let a"> {{a.doctor}} </td>
      </ng-container>
      <ng-container matColumnDef="date">
        <th mat-header-cell *matHeaderCellDef> التاريخ </th>
        <td mat-cell *matCellDef="let a"> {{a.date}} </td>
      </ng-container>
      <ng-container matColumnDef="time">
        <th mat-header-cell *matHeaderCellDef> الوقت </th>
        <td mat-cell *matCellDef="let a"> {{a.start_time}} - {{a.end_time}} </td>
      </ng-container>
      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef> الحالة </th>
        <td mat-cell *matCellDef="let a"> {{a.status}} </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styles: [`
    table { width: 100%; margin-top: 2rem; }
  `]
})
export class AppointmentTableComponent implements OnInit {
  appointments: BookingOut[] = [];
  displayedColumns = ['id', 'name', 'email', 'phone', 'age', 'gender', 'role', 'doctor', 'date', 'time', 'status'];
  
  constructor(
    private clinic: ClinicService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.clinic.getAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
      },
      error: (error) => {
        this.snackBar.open('خطأ في تحميل المواعيد', 'إغلاق', { duration: 3000 });
        console.error('Error loading appointments:', error);
      }
    });
  }
}
