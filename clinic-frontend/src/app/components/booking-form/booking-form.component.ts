import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ClinicService } from '../../services/clinic.service';
import { FormControl } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule
  ],
  template: `
    <div class="booking-card">
      <form [formGroup]="form" class="booking-form" (ngSubmit)="submit()">
        <h2 class="booking-title">حجز موعد جديد</h2>
        <ng-container *ngIf="!isLoggedIn">
          <mat-form-field appearance="fill">
            <mat-label>الاسم الكامل</mat-label>
            <input matInput formControlName="name" required>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>رقم الهاتف</mat-label>
            <input matInput formControlName="phone" required>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>البريد الإلكتروني</mat-label>
            <input matInput formControlName="email" required type="email">
          </mat-form-field>
        </ng-container>
        <mat-form-field appearance="fill">
          <mat-label>تاريخ الحجز</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date" required (dateChange)="onDateChange($event)">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>الوقت المتاح</mat-label>
          <mat-select formControlName="slot" required [disabled]="!availableSlots.length">
            <mat-option *ngFor="let slot of availableSlots" [value]="slot">{{ slot }}</mat-option>
          </mat-select>
        </mat-form-field>
        <div class="actions">
          <button mat-raised-button color="primary" class="confirm-btn" type="submit" [disabled]="isLoggedIn ? form.get('date')?.invalid || form.get('slot')?.invalid || !availableSlots.length : form.invalid || !availableSlots.length">تأكيد الحجز</button>
          <button mat-button class="cancel-btn" type="button" (click)="form.reset()">إلغاء</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .booking-card {
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 4px 24px rgba(63, 81, 181, 0.10);
      padding: 32px 24px 24px 24px;
      max-width: 400px;
      margin: 0 auto;
    }
    .booking-title {
      text-align: center;
      color: #3f51b5;
      margin-bottom: 18px;
      font-weight: 700;
      font-size: 1.3rem;
    }
    .booking-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
    }
    .confirm-btn {
      background: linear-gradient(90deg, #3f51b5 0%, #5c6bc0 100%) !important;
      color: #fff !important;
      border-radius: 8px;
      padding: 12px 28px;
      font-size: 1.1rem;
      font-weight: 700;
    }
    .confirm-btn[disabled] {
      background: #cfd8dc !important;
      color: #888 !important;
      cursor: not-allowed;
    }
    .cancel-btn {
      color: #888 !important;
      font-size: 1rem;
      border-radius: 6px;
    }
    .cancel-btn:hover {
      background: #f1f5f9 !important;
    }
  `]
})
export class BookingFormComponent implements OnInit {
  form!: FormGroup;
  availableSlots: string[] = [];
  isLoggedIn = false;
  currentUser: any = null;

  constructor(
    private fb: FormBuilder,
    private clinicService: ClinicService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.isLoggedIn = !!this.currentUser;
    // أعد تهيئة النموذج بناءً على حالة تسجيل الدخول
    this.form = this.fb.group({
      name: ['', this.isLoggedIn ? [] : Validators.required],
      phone: ['', this.isLoggedIn ? [] : Validators.required],
      email: ['', this.isLoggedIn ? [] : [Validators.required, Validators.email]],
      date: ['', Validators.required],
      slot: ['', Validators.required]
    });
    if (this.isLoggedIn && !this.currentUser) {
      this.clinicService.getCurrentUser().subscribe({
        next: user => {
          this.currentUser = user;
          this.isLoggedIn = true;
        },
        error: () => {
          this.currentUser = null;
          this.isLoggedIn = false;
        }
      });
    }
  }

  onDateChange(event: any) {
    const date = this.form.get('date')?.value;
    if (date) {
      const formattedDate = this.formatDate(date);
      this.clinicService.getAvailableSlots(formattedDate).subscribe({
        next: (slots) => this.availableSlots = slots,
        error: () => this.availableSlots = []
      });
    } else {
      this.availableSlots = [];
    }
    this.form.get('slot')?.reset();
  }

  formatDate(date: Date): string {
    // yyyy-mm-dd
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  submit() {
    if (this.form.valid) {
      const { name, phone, email, date, slot } = this.form.value;
      if (!slot) return;
      const [start_time, end_time] = slot.split(' - ');
      const payload: any = {
        date: this.formatDate(date),
        start_time: start_time.trim(),
        end_time: end_time.trim()
      };
      // فقط إذا لم يكن مسجل دخول أرسل بيانات المستخدم
      if (!this.isLoggedIn) {
        payload.name = name;
        payload.phone_number = phone;
        payload.email = email;
      }
      // إذا كان مسجل دخول لا ترسل بيانات المستخدم، الباكند سيأخذها من التوكن
      this.clinicService.createAppointment(payload).subscribe({
        next: () => {
          this.snackBar.open('تم إرسال طلب الحجز بنجاح!', 'إغلاق', { duration: 3000 });
          this.form.reset();
          this.availableSlots = [];
        },
        error: () => {
          this.snackBar.open('حدث خطأ أثناء الحجز، حاول مرة أخرى', 'إغلاق', { duration: 3000 });
        }
      });
    }
  }
}
