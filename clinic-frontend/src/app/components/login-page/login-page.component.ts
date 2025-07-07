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
  selector: 'app-login-page',
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
    <div class="login-container">
      <mat-card class="login-card animate-card" [ngClass]="{ 'shake': form.invalid && form.touched }">
        <div class="login-icon animate-bounce" [ngClass]="{ 'success-check': loginSuccess }">
          <span class="material-symbols-rounded" *ngIf="!loginSuccess">local_hospital</span>
          <span class="material-symbols-rounded checkmark" *ngIf="loginSuccess">check_circle</span>
        </div>
        <mat-card-header>
          <mat-card-title>تسجيل الدخول - عيادة طبية</mat-card-title>
          <div class="login-mode-toggle">
            <button mat-button (click)="toggleLoginMode()" class="toggle-btn">
              {{ isAdminLogin ? 'تسجيل دخول المريض' : 'تسجيل دخول الأدمن' }}
            </button>
          </div>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="login()" class="login-form">
            <mat-form-field appearance="fill" class="animated-field field-anim" [ngClass]="{ 'shake': shakeEmail }" style="animation-delay:0.1s">
              <mat-label>البريد الإلكتروني</mat-label>
              <input matInput formControlName="email" required type="email" (blur)="onEmailBlur()">
              <mat-error *ngIf="form.get('email')?.hasError('required')">البريد الإلكتروني مطلوب</mat-error>
              <mat-error *ngIf="form.get('email')?.hasError('email')">بريد إلكتروني غير صحيح</mat-error>
            </mat-form-field>
            <mat-form-field appearance="fill" class="animated-field field-anim" [ngClass]="{ 'shake': shakePassword }" style="animation-delay:0.25s">
              <mat-label>كلمة المرور</mat-label>
              <input matInput formControlName="password" required type="password" (blur)="onPasswordBlur()">
              <mat-error *ngIf="form.get('password')?.hasError('required')">كلمة المرور مطلوبة</mat-error>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading" class="login-btn animated-btn ripple">
              {{ loading ? 'جاري تسجيل الدخول...' : 'دخول' }}
              <span class="ripple-effect"></span>
            </button>
            <div class="register-link">
              <span>ليس لديك حساب؟</span>
              <a mat-button routerLink="/register" class="animated-link">إنشاء حساب جديد</a>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@500;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded');
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #7f9cf5 0%, #a78bfa 100%);
      overflow: hidden;
    }
    .login-card {
      max-width: 410px;
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
    .login-card.shake {
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
    .login-icon {
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
    .login-mode-toggle {
      text-align: center;
      margin-top: 1rem;
    }
    .toggle-btn {
      color: #7f9cf5;
      font-weight: 500;
      border: 1px solid #e0e7ff;
      border-radius: 8px;
      padding: 8px 16px;
      transition: all 0.3s ease;
    }
    .toggle-btn:hover {
      background: #f0f4ff;
      border-color: #7f9cf5;
    }
    .login-form {
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
    .login-btn {
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
    .login-btn:disabled {
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
    .register-link {
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
      .login-card {
        max-width: 98vw;
        margin: 8px;
        padding: 0 2px 18px 2px;
      }
    }
  `]
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loading = false;
  loginSuccess = false;
  isAdminLogin = false;
  private routerSubscription!: Subscription;
  shakeEmail = false;
  shakePassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.resetState();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  resetState() {
    this.loading = false;
    this.loginSuccess = false;
    this.form.reset();
  }

  onEmailBlur() {
    if (this.form.get('email')?.invalid && this.form.get('email')?.touched) {
      this.shakeEmail = true;
      setTimeout(() => this.shakeEmail = false, 600);
    }
  }

  onPasswordBlur() {
    if (this.form.get('password')?.invalid && this.form.get('password')?.touched) {
      this.shakePassword = true;
      setTimeout(() => this.shakePassword = false, 600);
    }
  }

  login() {
    if (this.form.valid) {
      this.loading = true;
      const { email, password } = this.form.value;

      const loginObservable = this.isAdminLogin 
        ? this.authService.adminLogin(email, password)
        : this.authService.login(email, password);

      loginObservable.subscribe({
        next: (user) => {
          this.loading = false;
          this.loginSuccess = true;
          
          setTimeout(() => {
            if (user.role === 'admin') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/']);
            }
          }, 1000);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('خطأ في تسجيل الدخول', 'إغلاق', { duration: 3000 });
        }
      });
    }
  }

  toggleLoginMode() {
    this.isAdminLogin = !this.isAdminLogin;
    this.form.reset();
  }
} 