import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatCardModule,
    MatSnackBarModule,
    RouterModule
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card animate-card" [ngClass]="{ 'shake': form.invalid && form.touched }">
        <div class="register-icon animate-bounce" [ngClass]="{ 'success-check': registrationSuccess }">
          <span class="material-symbols-rounded" *ngIf="!registrationSuccess">person_add</span>
          <span class="material-symbols-rounded checkmark" *ngIf="registrationSuccess">check_circle</span>
        </div>
        <mat-card-header>
          <mat-card-title>إنشاء حساب جديد - عيادة طبية</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="register()" class="register-form">
            <mat-form-field appearance="fill" class="animated-field field-anim" [ngClass]="{ 'shake': form.get('name')?.invalid && form.get('name')?.touched }" style="animation-delay:0.1s">
              <mat-label>الاسم الكامل</mat-label>
              <input matInput formControlName="name" required>
              <mat-error *ngIf="form.get('name')?.hasError('required')">الاسم مطلوب</mat-error>
            </mat-form-field>
            <mat-form-field appearance="fill" class="animated-field field-anim" [ngClass]="{ 'shake': form.get('email')?.invalid && form.get('email')?.touched }" style="animation-delay:0.25s">
              <mat-label>البريد الإلكتروني</mat-label>
              <input matInput formControlName="email" required type="email">
              <mat-error *ngIf="form.get('email')?.hasError('required')">البريد الإلكتروني مطلوب</mat-error>
              <mat-error *ngIf="form.get('email')?.hasError('email')">بريد إلكتروني غير صحيح</mat-error>
            </mat-form-field>
            <mat-form-field appearance="fill" class="animated-field field-anim" [ngClass]="{ 'shake': form.get('phone_number')?.invalid && form.get('phone_number')?.touched }" style="animation-delay:0.35s">
              <mat-label>رقم الهاتف</mat-label>
              <input matInput formControlName="phone_number" required type="tel">
              <mat-error *ngIf="form.get('phone_number')?.hasError('required')">رقم الهاتف مطلوب</mat-error>
            </mat-form-field>
            <mat-form-field appearance="fill" class="animated-field field-anim" [ngClass]="{ 'shake': form.get('age')?.invalid && form.get('age')?.touched }" style="animation-delay:0.45s">
              <mat-label>العمر</mat-label>
              <input matInput formControlName="age" required type="number" min="1">
              <mat-error *ngIf="form.get('age')?.hasError('required')">العمر مطلوب</mat-error>
              <mat-error *ngIf="form.get('age')?.hasError('min')">يجب أن يكون العمر أكبر من 0</mat-error>
            </mat-form-field>
            <mat-form-field appearance="fill" class="animated-field field-anim" [ngClass]="{ 'shake': form.get('gender')?.invalid && form.get('gender')?.touched }" style="animation-delay:0.55s">
              <mat-label>الجنس</mat-label>
              <input matInput formControlName="gender" required type="text">
              <mat-error *ngIf="form.get('gender')?.hasError('required')">الجنس مطلوب</mat-error>
            </mat-form-field>
            <mat-form-field appearance="fill" class="animated-field field-anim" [ngClass]="{ 'shake': form.get('password')?.invalid && form.get('password')?.touched }" style="animation-delay:0.65s">
              <mat-label>كلمة المرور</mat-label>
              <input matInput formControlName="password" required type="password">
              <mat-error *ngIf="form.get('password')?.hasError('required')">كلمة المرور مطلوبة</mat-error>
              <mat-error *ngIf="form.get('password')?.hasError('minlength')">كلمة المرور يجب أن تكون 6 أحرف على الأقل</mat-error>
            </mat-form-field>
            <mat-form-field appearance="fill" class="animated-field field-anim" [ngClass]="{ 'shake': form.get('confirmPassword')?.invalid && form.get('confirmPassword')?.touched }" style="animation-delay:0.75s">
              <mat-label>تأكيد كلمة المرور</mat-label>
              <input matInput formControlName="confirmPassword" required type="password">
              <mat-error *ngIf="form.get('confirmPassword')?.hasError('required')">تأكيد كلمة المرور مطلوب</mat-error>
              <mat-error *ngIf="form.get('confirmPassword')?.hasError('passwordMismatch')">كلمة المرور غير متطابقة</mat-error>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading" class="register-btn animated-btn ripple">
              {{ loading ? 'جاري التسجيل...' : 'إنشاء حساب' }}
              <span class="ripple-effect"></span>
            </button>
            <div class="login-link">
              <span>لديك حساب بالفعل؟</span>
              <a mat-button routerLink="/login" class="animated-link">تسجيل الدخول</a>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@500;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded');
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #7f9cf5 0%, #a78bfa 100%);
      overflow: hidden;
    }
    .register-card {
      max-width: 440px;
      width: 100%;
      margin: 20px;
      border-radius: 22px;
      box-shadow: 0 8px 32px 0 rgba(76, 110, 245, 0.13), 0 1.5px 8px 0 rgba(120, 139, 250, 0.08);
      padding-bottom: 18px;
      font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #fafdff 60%, #e9f0fb 100%);
      position: relative;
      opacity: 0;
      transform: translateY(20px);
      animation: fadeSlideIn 1.2s ease-out 0.2s forwards;
      transition: opacity 0.4s ease, transform 0.4s ease;
      will-change: transform, opacity;
    }
    .register-card.shake {
      animation: shake 0.6s ease-in-out, fadeSlideIn 1.2s ease-out 0.2s forwards;
    }
    @keyframes fadeSlideIn {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes shake {
      0%, 100% { transform: translateY(0) translateX(0); }
      25% { transform: translateY(0) translateX(-3px); }
      75% { transform: translateY(0) translateX(3px); }
    }
    .register-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: -32px;
      margin-bottom: 8px;
    }
    .animate-bounce {
      animation: bounceIn 1.5s ease-out;
    }
    @keyframes bounceIn {
      0% { transform: scale(0.9); opacity: 0; }
      50% { transform: scale(1.05); opacity: 0.8; }
      100% { transform: scale(1); opacity: 1; }
    }
    .success-check {
      animation: checkSuccess 0.8s ease-out;
    }
    @keyframes checkSuccess {
      0% { transform: scale(0.8) rotate(-10deg); opacity: 0; }
      50% { transform: scale(1.1) rotate(5deg); opacity: 0.8; }
      100% { transform: scale(1) rotate(0); }
    }
    .checkmark {
      color: #43b581;
      font-size: 54px;
      transition: color 0.2s;
    }
    .material-symbols-rounded {
      font-family: 'Material Symbols Rounded';
      font-size: 48px;
      color: #7f9cf5;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(127,156,245,0.10);
      padding: 10px;
      border: 2px solid #e0e7ff;
      transition: color 0.2s;
    }
    mat-card-title {
      text-align: center;
      font-size: 1.35rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 0.5rem;
      font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    mat-card-content {
      margin-top: 0.5rem;
    }
    .register-form {
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
      margin-top: 1rem;
    }
    .field-anim {
      opacity: 0;
      transform: translateY(15px);
      animation: fieldFadeIn 1s ease-out forwards;
    }
    .field-anim:nth-child(1) { animation-delay: 0.3s; }
    .field-anim:nth-child(2) { animation-delay: 0.5s; }
    .field-anim:nth-child(3) { animation-delay: 0.7s; }
    .field-anim:nth-child(4) { animation-delay: 0.9s; }
    @keyframes fieldFadeIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animated-field:focus-within, .animated-field.mat-focused {
      box-shadow: 0 2px 8px rgba(127,156,245,0.08);
      transform: scale(1.01);
      transition: box-shadow 0.3s ease, transform 0.3s ease;
      background: #f8fbff;
    }
    .animated-field.shake {
      animation: fieldShake 0.6s ease-in-out;
    }
    @keyframes fieldShake {
      0%, 100% { transform: scale(1.01) translateX(0); }
      25% { transform: scale(1.01) translateX(-2px); }
      75% { transform: scale(1.01) translateX(2px); }
    }
    .mat-mdc-form-field-infix {
      border-radius: 10px;
      font-size: 0.98rem;
      color: #222;
      min-height: 32px;
      padding-top: 2px;
      padding-bottom: 2px;
      transition: background 0.2s;
    }
    input[matInput] {
      font-size: 0.98rem;
      color: #222;
      padding: 7px 7px;
      border-radius: 7px;
      background: transparent;
      min-height: 28px;
      transition: box-shadow 0.2s, border 0.2s;
    }
    .mat-mdc-form-field-error {
      color: #e53935 !important;
      font-size: 0.98rem;
      font-weight: 500;
      margin-top: 2px;
      opacity: 0;
      animation: fadeInText 0.5s forwards;
    }
    @keyframes fadeInText {
      to { opacity: 1; }
    }
    .register-btn {
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 700;
      padding: 12px 0;
      background: linear-gradient(90deg, #7f9cf5 0%, #a78bfa 100%);
      color: #fff;
      box-shadow: 0 2px 8px rgba(127,156,245,0.10);
      transition: background 0.2s, transform 0.2s;
      position: relative;
      overflow: hidden;
    }
    .animated-btn:hover:not(:disabled) {
      background: linear-gradient(90deg, #6c8cf5 0%, #8b7ffa 100%);
      transform: scale(1.02);
      box-shadow: 0 3px 12px rgba(127,156,245,0.15);
      transition: all 0.3s ease;
    }
    .register-btn:disabled {
      background: #e0e7ff;
      color: #b4b4b4;
    }
    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      background-color: rgba(127,156,245,0.15);
      pointer-events: none;
      z-index: 2;
      left: 50%;
      top: 50%;
      width: 80px;
      height: 80px;
      opacity: 0.6;
    }
    @keyframes ripple {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
    .login-link {
      text-align: center;
      margin-top: 1.2rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
      font-size: 1rem;
    }
    .animated-link {
      color: #7f9cf5;
      text-decoration: none;
      font-weight: 700;
      margin-right: 4px;
      transition: color 0.2s, text-decoration 0.2s;
    }
    .animated-link:hover {
      color: #4c6ef5;
      text-decoration: underline;
    }
    @media (max-width: 600px) {
      .register-card {
        max-width: 98vw;
        margin: 8px;
        padding: 0 2px 18px 2px;
      }
    }
  `]
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loading = false;
  registrationSuccess = false;
  private subscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      gender: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.resetState();
  }

  resetState() {
    this.loading = false;
    this.registrationSuccess = false;
    this.form.reset();
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  register() {
    if (this.form.valid) {
      this.loading = true;
      const { name, email, phone_number, age, gender, password } = this.form.value;
      
      this.authService.register({ name, email, phone_number, age, gender, password }).subscribe({
        next: (user) => {
          this.loading = false;
          this.registrationSuccess = true;
          this.snackBar.open('تم إنشاء الحساب بنجاح', 'إغلاق', { duration: 3000 });
          this.router.navigate(['/user']);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('خطأ في التسجيل: ' + (error.error?.message || 'حدث خطأ'), 'إغلاق', { duration: 5000 });
        }
      });
    }
  }
} 