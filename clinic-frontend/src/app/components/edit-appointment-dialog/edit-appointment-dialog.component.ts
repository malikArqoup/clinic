import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BookingOut } from '../../services/clinic.service';

@Component({
  selector: 'app-edit-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="edit-dialog">
      <h2 mat-dialog-title>تعديل الحجز</h2>
      
      <mat-dialog-content>
        <form [formGroup]="form" class="edit-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>التاريخ</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date" required>
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>وقت البداية</mat-label>
            <input matInput formControlName="start_time" placeholder="مثال: 10:00 AM" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>وقت النهاية</mat-label>
            <input matInput formControlName="end_time" placeholder="مثال: 10:30 AM" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>الحالة</mat-label>
            <mat-select formControlName="status" required>
              <mat-option value="pending">في الانتظار</mat-option>
              <mat-option value="confirmed">مؤكد</mat-option>
              <mat-option value="cancelled">ملغي</mat-option>
              <mat-option value="completed">مكتمل</mat-option>
              <mat-option value="booked">محجوز</mat-option>
            </mat-select>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">إلغاء</button>
        <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!form.valid">
          حفظ التغييرات
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .edit-dialog {
      padding: 20px;
      direction: rtl;
    }
    
    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 16px;
    }
    
    .full-width {
      width: 100%;
    }
    
    mat-dialog-actions {
      margin-top: 20px;
    }
    
    h2 {
      margin: 0 0 20px 0;
      color: #333;
      text-align: center;
    }
  `]
})
export class EditAppointmentDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditAppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      appointment: BookingOut;
      form: FormGroup;
    }
  ) {
    this.form = data.form;
  }

  ngOnInit() {
    // Form is already patched with data from parent component
  }

  onSave() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 