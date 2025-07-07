import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="signup()" class="signup-form">
      <h2>تسجيل حساب جديد</h2>
      <mat-form-field appearance="fill">
        <mat-label>الاسم</mat-label>
        <input matInput formControlName="name" required>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>البريد الإلكتروني</mat-label>
        <input matInput formControlName="email" required type="email">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>كلمة المرور</mat-label>
        <input matInput formControlName="password" required type="password">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>تأكيد كلمة المرور</mat-label>
        <input matInput formControlName="confirmPassword" required type="password">
      </mat-form-field>
      <button mat-raised-button color="accent" type="submit" [disabled]="form.invalid">تسجيل</button>
    </form>
  `,
  styles: [`
    .signup-form { max-width: 350px; margin: 2rem auto; display: flex; flex-direction: column; gap: 1rem; }
  `]
})
export class SignupPageComponent {
  form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }
  signup() {
    // منطق التسجيل التجريبي
    alert('تم التسجيل (تجريبي)');
  }
} 