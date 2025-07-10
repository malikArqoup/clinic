import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClinicService, SliderImage, User, DashboardStats, BookingOut } from '../../services/clinic.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EditAppointmentDialogComponent } from '../edit-appointment-dialog/edit-appointment-dialog.component';
import { AddSliderImageDialogComponent } from './add-slider-image-dialog.component';
import { EditUserDialogComponent } from './edit-user-dialog.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatBadgeModule,
    MatProgressBarModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="admin-dashboard">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-left">
            <h1 class="dashboard-title">
              <mat-icon>admin_panel_settings</mat-icon>
              لوحة الإدارة
            </h1>
            <p class="dashboard-subtitle">مرحباً بك في نظام إدارة عيادة الشفاء</p>
          </div>
          <div class="header-right">
            <div class="admin-info">
              <div class="admin-avatar">
                <mat-icon>person</mat-icon>
              </div>
              <div class="admin-details">
                <span class="admin-name">مدير النظام</span>
                <span class="admin-role">Administrator</span>
              </div>
              <!-- زر تسجيل الخروج الجديد -->
              <button mat-icon-button color="warn" (click)="logout()" matTooltip="تسجيل الخروج" style="margin-right: 8px; margin-top: 4px;">
                <mat-icon>logout</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Quick Stats -->
      <section class="stats-section">
        <div class="stats-grid">
          <div class="stat-card" *ngFor="let stat of quickStats">
            <div class="stat-icon" [style.background]="stat.color">
              <mat-icon>{{ stat.icon }}</mat-icon>
            </div>
          <div class="stat-content">
              <div class="stat-number">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
              <div class="stat-change" [class.positive]="stat.change > 0" [class.negative]="stat.change < 0">
                <mat-icon>{{ stat.change > 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
                {{ Math.abs(stat.change) }}%
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <section class="main-content">
        <mat-tab-group class="dashboard-tabs" animationDuration="300ms" (selectedTabChange)="onTabChange($event)">
          
          <!-- Dashboard Overview -->
          <mat-tab label="لوحة التحكم">
            <div class="tab-content">
              <div class="overview-grid">
                <!-- Recent Appointments -->
                <div class="overview-card">
                  <div class="card-header">
                    <h3>آخر الحجوزات</h3>
                    <button mat-button color="primary" (click)="toggleShowAllRecent()">{{ showAllRecent ? 'عرض أقل' : 'عرض الكل' }}</button>
                  </div>
                  <div class="recent-appointments">
                    <div class="appointment-item" *ngFor="let appointment of recentAppointments">
                      <div class="appointment-avatar">
                        <mat-icon>person</mat-icon>
                      </div>
                      <div class="appointment-details">
                        <div class="patient-name">{{ appointment.user?.name || 'غير محدد' }}</div>
                        <div class="appointment-time">{{ appointment.date }} - {{ appointment.start_time }} - {{ appointment.end_time }}</div>
                        <div class="appointment-status">
                          <mat-chip [color]="getStatusColor(appointment.status)" selected>
                            {{ getStatusText(appointment.status) }}
                          </mat-chip>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- System Status -->
                <div class="overview-card">
                  <div class="card-header">
                    <h3>حالة النظام</h3>
                    <mat-icon class="status-icon">check_circle</mat-icon>
                  </div>
                  <div class="system-status">
                    <div class="status-item">
                      <span class="status-label">قاعدة البيانات</span>
                      <mat-progress-bar mode="determinate" value="95" color="primary"></mat-progress-bar>
                      <span class="status-value">95%</span>
                    </div>
                    <div class="status-item">
                      <span class="status-label">الخادم</span>
                      <mat-progress-bar mode="determinate" value="88" color="accent"></mat-progress-bar>
                      <span class="status-value">88%</span>
                    </div>
                    <div class="status-item">
                      <span class="status-label">الأمان</span>
                      <mat-progress-bar mode="determinate" value="100" color="primary"></mat-progress-bar>
                      <span class="status-value">100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Appointments Management -->
          <mat-tab label="إدارة الحجوزات">
            <div class="tab-content">
              <div class="appointments-header">
                <div class="header-actions">
                  <button mat-raised-button color="primary" class="action-button">
                    <mat-icon>add</mat-icon>
                    إضافة موعد جديد
                  </button>
                  <button mat-button class="action-button">
                    <mat-icon>filter_list</mat-icon>
                    تصفية
                  </button>
                  <button mat-button class="action-button">
                    <mat-icon>download</mat-icon>
                    تصدير
                  </button>
                </div>
                <!-- مربع البحث الموحد أعلى كل جدول -->
                <div style="display: flex; justify-content: flex-start; margin-bottom: 24px;">
                  <div class="custom-search-bar">
                    <span class="search-icon">
                      <svg width="24" height="24" fill="none" stroke="#3f51b5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                    </span>
                    <input
                      type="search"
                      [(ngModel)]="searchAppointmentQuery"
                      (keyup.enter)="searchAppointments()"
                      (input)="onSearchInputAppointments()"
                      placeholder="ابحث..."
                    />
                    <button *ngIf="searchAppointmentQuery" class="clear-btn" (click)="clearSearchAppointments()">
                      <svg width="20" height="20" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="10" cy="10" r="10" fill="#3f51b5"/>
                        <line x1="7" y1="7" x2="13" y2="13"/>
                        <line x1="13" y1="7" x2="7" y2="13"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Search Results Info -->
              <div *ngIf="searchAppointmentQuery && !loading" class="search-results-info">
                <span>نتائج البحث: {{ appointments.length }} حجز</span>
              </div>

              <div class="appointments-table">
                <div *ngIf="loading" class="loading-container">
                  <mat-progress-bar mode="indeterminate"></mat-progress-bar>
                  <p>جاري البحث...</p>
                </div>
                <table mat-table [dataSource]="appointments" class="mat-elevation-z8" *ngIf="!loading">
                  <!-- Patient Name Column -->
                  <ng-container matColumnDef="patientName">
                    <th mat-header-cell *matHeaderCellDef>اسم المريض</th>
                    <td mat-cell *matCellDef="let element">{{ element.user?.name || 'غير محدد' }}</td>
                  </ng-container>

                  <!-- Phone Column -->
                  <ng-container matColumnDef="phone">
                    <th mat-header-cell *matHeaderCellDef>رقم الهاتف</th>
                    <td mat-cell *matCellDef="let element">{{ element.user?.phone_number || 'غير محدد' }}</td>
                  </ng-container>

                  <!-- Date Column -->
                  <ng-container matColumnDef="date">
                    <th mat-header-cell *matHeaderCellDef>التاريخ</th>
                    <td mat-cell *matCellDef="let element">{{ element.date }}</td>
                  </ng-container>

                  <!-- Time Column -->
                  <ng-container matColumnDef="time">
                    <th mat-header-cell *matHeaderCellDef>الوقت</th>
                    <td mat-cell *matCellDef="let element">{{ element.start_time }} - {{ element.end_time }}</td>
                  </ng-container>

                  <!-- Status Column -->
                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>الحالة</th>
                    <td mat-cell *matCellDef="let element">
                      <mat-chip [color]="getStatusColor(element.status)" selected>
                        {{ getStatusText(element.status) }}
                      </mat-chip>
                    </td>
                  </ng-container>

                  <!-- Actions Column -->
                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>الإجراءات</th>
                    <td mat-cell *matCellDef="let element">
                      <button mat-icon-button color="primary" matTooltip="تأكيد" *ngIf="element.status === 'pending'" (click)="confirmAppointment(element)">
                        <mat-icon>check_circle</mat-icon>
                      </button>
                      <button mat-icon-button color="accent" matTooltip="إلغاء" *ngIf="element.status === 'confirmed'" (click)="cancelAppointment(element)">
                        <mat-icon>cancel</mat-icon>
                      </button>
                      <button mat-icon-button color="primary" matTooltip="تعديل" (click)="editAppointment(element)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button color="warn" matTooltip="حذف" (click)="deleteAppointment(element)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="appointmentColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: appointmentColumns;"></tr>
                </table>

                <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of appointments"></mat-paginator>
              </div>
            </div>
          </mat-tab>

          <!-- Slider Management -->
          <mat-tab label="إدارة السلايدر">
            <div class="tab-content">
              <div class="slider-header">
                <h3>إدارة صور السلايدر</h3>
                <button mat-raised-button color="primary" (click)="addSliderImage()">
                  <mat-icon>add_photo_alternate</mat-icon>
                  إضافة صورة جديدة
                </button>
              </div>

              <div class="slider-grid">
                <div class="slider-item" *ngFor="let slide of sliderImages; let i = index">
                  <div class="slider-image">
                    <img [src]="getImageUrl(slide.image_url)" [alt]="slide.title" style="width:100%;height:180px;object-fit:cover;display:block;">
                  </div>
                  <div class="slider-info">
                    <h4>{{ slide.title }}</h4>
                    <p>{{ slide.text }}</p>
                    <div class="slider-order">
                      <span>الترتيب: {{ i + 1 }}</span>
                    </div>
                    <div class="slider-actions" style="margin-top: 10px; text-align: left;">
                      <button mat-icon-button color="primary" matTooltip="تعديل" (click)="editSliderImage(slide)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button color="warn" matTooltip="حذف" (click)="deleteSliderImage(slide)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- User Management -->
          <mat-tab label="إدارة المستخدمين">
            <div class="tab-content">
              <div class="users-header">
                <div class="header-actions">
                  <button mat-raised-button color="primary">
                    <mat-icon>person_add</mat-icon>
                    إضافة مستخدم جديد
                  </button>
                  <button mat-button>
                    <mat-icon>filter_list</mat-icon>
                    تصفية
                  </button>
                </div>
                <!-- شريط البحث العصري للمستخدمين -->
                <div style="display: flex; justify-content: flex-start; margin: 24px 0 18px 0;">
                  <div class="custom-search-bar">
                    <span class="search-icon">
                      <svg width="24" height="24" fill="none" stroke="#3f51b5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                    </span>
                    <input
                      type="search"
                      [(ngModel)]="searchUserQuery"
                      (keyup.enter)="searchUsers()"
                      (input)="onSearchInputUsers()"
                      placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                    />
                    <button *ngIf="searchUserQuery" class="clear-btn" (click)="clearSearchUsers()">
                      <svg width="20" height="20" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="10" cy="10" r="10" fill="#3f51b5"/>
                        <line x1="7" y1="7" x2="13" y2="13"/>
                        <line x1="13" y1="7" x2="7" y2="13"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <!-- جدول المستخدمين -->
                <table mat-table [dataSource]="users" class="mat-elevation-z8 custom-table" *ngIf="!loading">
                  <!-- Avatar Column -->
                  <ng-container matColumnDef="avatar">
                    <th mat-header-cell *matHeaderCellDef>الصورة</th>
                    <td mat-cell *matCellDef="let element">
                      <div class="user-avatar">
                        <mat-icon>person</mat-icon>
          </div>
                    </td>
                  </ng-container>

                  <!-- Name Column -->
                  <ng-container matColumnDef="name">
                    <th mat-header-cell *matHeaderCellDef>الاسم</th>
                    <td mat-cell *matCellDef="let element">{{ element.name }}</td>
                  </ng-container>

                  <!-- Email Column -->
                  <ng-container matColumnDef="email">
                    <th mat-header-cell *matHeaderCellDef>البريد الإلكتروني</th>
                    <td mat-cell *matCellDef="let element">{{ element.email }}</td>
                  </ng-container>

                  <!-- Role Column -->
                  <ng-container matColumnDef="role">
                    <th mat-header-cell *matHeaderCellDef>الدور</th>
                    <td mat-cell *matCellDef="let element">
                      <mat-chip [color]="getRoleColor(element.role)" selected>
                        {{ getRoleText(element.role) }}
                      </mat-chip>
                    </td>
                  </ng-container>

                  <!-- Status Column -->
                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>الحالة</th>
                    <td mat-cell *matCellDef="let element">
                      <mat-chip [color]="element.status === 'active' ? 'primary' : 'warn'" selected>
                        {{ element.status === 'active' ? 'نشط' : 'غير نشط' }}
                      </mat-chip>
                    </td>
                  </ng-container>

                  <!-- Actions Column -->
                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>الإجراءات</th>
                    <td mat-cell *matCellDef="let element">
                      <!-- زر القلم (تعديل) يظهر فقط إذا كان هناك دالة تعديل -->
                      <button mat-icon-button color="primary" matTooltip="تعديل" *ngIf="canEditUser(element)" (click)="editUser(element)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button color="warn" matTooltip="حذف" (click)="deleteUser(element)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="userColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: userColumns;"></tr>
                </table>

                <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of users"></mat-paginator>
              </div>
            </div>
          </mat-tab>

          <!-- Settings -->
          <mat-tab label="الإعدادات">
            <div class="tab-content">
              <div class="settings-grid">
                <div class="settings-card">
                  <h3>إعدادات عامة</h3>
                  <form [formGroup]="clinicInfoForm" (ngSubmit)="saveClinicInfo()">
                    <div class="setting-item">
                      <label>اسم العيادة</label>
                      <input type="text" formControlName="name" class="setting-input">
                    </div>
                    <div class="setting-item">
                      <label>رقم الهاتف</label>
                      <input type="tel" formControlName="phone" class="setting-input">
                    </div>
                    <div class="setting-item">
                      <label>البريد الإلكتروني</label>
                      <input type="email" formControlName="email" class="setting-input">
                    </div>
                    <div class="setting-item">
                      <label>العنوان</label>
                      <textarea formControlName="address" class="setting-input"></textarea>
          </div>
                    <button mat-raised-button color="primary" [disabled]="clinicInfoForm.invalid || savingClinicInfo">
                      {{ savingClinicInfo ? 'جاري الحفظ...' : 'حفظ الإعدادات' }}
                    </button>
                  </form>
      </div>

                <div class="settings-card">
                  <h3>إعدادات الحجز وأوقات العمل</h3>
                  <div class="availability-section">
                    <h2 class="section-title">إعدادات أوقات العمل</h2>
                    <form class="availability-form" (ngSubmit)="addTimeRange()">
                      <mat-form-field appearance="fill">
                        <mat-label>اليوم</mat-label>
                        <mat-select [(ngModel)]="selectedDay" name="weekday" required>
                          <mat-option *ngFor="let day of weekdays" [value]="day.value">{{ day.label }}</mat-option>
                        </mat-select>
                      </mat-form-field>
                      <mat-form-field appearance="fill">
                        <mat-label>من</mat-label>
                        <input matInput [(ngModel)]="startTime" name="startTime" required type="time">
                      </mat-form-field>
                      <mat-form-field appearance="fill">
                        <mat-label>إلى</mat-label>
                        <input matInput [(ngModel)]="endTime" name="endTime" required type="time">
                      </mat-form-field>
                      <button mat-raised-button color="primary" type="submit" [disabled]="!selectedDay || !startTime || !endTime">إضافة الفترة</button>
                    </form>
                    <div class="availability-list">
                      <h3 class="list-title">الفترات الحالية</h3>
                      <table class="availability-table">
                        <tr>
                          <th>اليوم</th>
                          <th>من</th>
                          <th>إلى</th>
                          <th>إجراء</th>
                        </tr>
                        <tr *ngFor="let slot of availability">
                          <td>{{ getDayLabel(slot.weekday) }}</td>
                          <td>{{ slot.start_time }}</td>
                          <td>{{ slot.end_time }}</td>
                          <td><button mat-button color="warn" (click)="deleteTimeRange(slot.id)">حذف</button></td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- رسائل التواصل -->
          <mat-tab label="رسائل التواصل">
            <div class="tab-content">
              <h2 style="margin-bottom: 16px;">رسائل التواصل</h2>
              <table class="mat-elevation-z8 custom-table" *ngIf="contactMessages.length > 0">
                <thead>
                  <tr>
                    <th>الاسم</th>
                    <th>البريد الإلكتروني</th>
                    <th>رقم الهاتف</th>
                    <th>الموضوع</th>
                    <th>الرسالة</th>
                    <th>تاريخ الإرسال</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let msg of contactMessages">
                    <td>{{ msg.name }}</td>
                    <td>{{ msg.email }}</td>
                    <td>{{ msg.phone || '-' }}</td>
                    <td>{{ msg.subject || '-' }}</td>
                    <td>{{ msg.message }}</td>
                    <td>{{ msg.created_at | date:'short' }}</td>
                  </tr>
                </tbody>
              </table>
              <div *ngIf="contactMessages.length === 0" style="text-align:center; color:#888;">لا توجد رسائل بعد.</div>
            </div>
          </mat-tab>

        </mat-tab-group>
      </section>
    </div>
  `,
  styles: `
    .admin-dashboard {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 24px;
    }

    /* Header */
    .dashboard-header {
      background: white;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .dashboard-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
    }
    
    .dashboard-title mat-icon {
      color: #3f51b5;
      font-size: 32px;
    }

    .dashboard-subtitle {
      color: #64748b;
      margin: 0;
      font-size: 1.1rem;
    }

    .admin-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .admin-avatar {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .admin-details {
      display: flex;
      flex-direction: column;
    }

    .admin-name {
      font-weight: 600;
      color: #1e293b;
    }

    .admin-role {
      font-size: 0.9rem;
      color: #64748b;
    }
    
    /* Stats Section */
    .stats-section {
      margin-bottom: 24px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
    }
    
    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-icon mat-icon {
      font-size: 28px;
    }
    
    .stat-content {
      flex: 1;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .stat-label {
      color: #64748b;
      margin-bottom: 8px;
    }

    .stat-change {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .stat-change.positive {
      color: #10b981;
    }

    .stat-change.negative {
      color: #ef4444;
    }

    /* Main Content */
    .main-content {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .dashboard-tabs {
      height: 100%;
    }

    .tab-content {
      padding: 24px;
    }

    /* Overview Grid */
    .overview-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .overview-card {
      background: #f8fafc;
      border-radius: 12px;
      padding: 20px;
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .card-header h3 {
      margin: 0;
      color: #1e293b;
      font-weight: 600;
    }

    .status-icon {
      color: #10b981;
    }

    /* Recent Appointments */
    .recent-appointments {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .appointment-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: white;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .appointment-avatar {
      width: 40px;
      height: 40px;
      background: #3f51b5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .appointment-details {
      flex: 1;
    }

    .patient-name {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .appointment-time {
      font-size: 0.9rem;
      color: #64748b;
      margin-bottom: 8px;
    }

    /* System Status */
    .system-status {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .status-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .status-label {
      min-width: 100px;
      font-weight: 500;
      color: #1e293b;
    }

    .status-value {
      min-width: 40px;
      font-weight: 600;
      color: #3f51b5;
    }

    /* Appointments Management */
    .appointments-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .search-box {
      margin: 20px 0;
      padding: 20px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    
    .appointments-table {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    /* Slider Management */
    .slider-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .slider-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .slider-item {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .slider-item:hover {
      transform: translateY(-4px);
    }

    .slider-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .slider-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .slider-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .slider-item:hover .slider-overlay {
      opacity: 1;
    }

    .slider-info {
      padding: 16px;
    }

    .slider-info h4 {
      margin: 0 0 8px 0;
      color: #1e293b;
    }
    
    .slider-info p {
      margin: 0 0 12px 0;
      color: #64748b;
      font-size: 0.9rem;
    }

    .slider-order {
      font-size: 0.8rem;
      color: #3f51b5;
      font-weight: 500;
    }

    /* User Management */
    .users-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .users-table {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      background: #3f51b5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    /* Settings */
    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }
    
    .settings-card {
      background: #f8fafc;
      border-radius: 12px;
      padding: 24px;
    }

    .settings-card h3 {
      margin: 0 0 20px 0;
      color: #1e293b;
      font-weight: 600;
    }

    .setting-item {
      margin-bottom: 20px;
    }

    .setting-item label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #1e293b;
    }

    .setting-input {
      width: 100%;
      padding: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .setting-input:focus {
      outline: none;
      border-color: #3f51b5;
    }

    .time-settings {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .time-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .time-input {
      padding: 8px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .admin-dashboard {
        padding: 16px;
      }

      .header-content {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .overview-grid {
        grid-template-columns: 1fr;
      }

      .appointments-header,
      .users-header {
        flex-direction: column;
        align-items: stretch;
      }

      .search-box {
        min-width: auto;
      }

      .slider-grid {
        grid-template-columns: 1fr;
      }
      
      .settings-grid {
        grid-template-columns: 1fr;
      }
    }

    .availability-section {
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 4px 24px rgba(63, 81, 181, 0.10);
      padding: 32px 24px 24px 24px;
      max-width: 600px;
      margin: 32px auto;
    }
    .section-title {
      color: #3f51b5;
      font-weight: 700;
      margin-bottom: 18px;
      font-size: 1.3rem;
      text-align: right;
    }
    .availability-form {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 18px;
    }
    .availability-list {
      margin-top: 18px;
    }
    .list-title {
      color: #222;
      font-weight: 600;
      margin-bottom: 10px;
      text-align: right;
    }
    .availability-table {
      width: 100%;
      border-collapse: collapse;
      background: #f8fafc;
      border-radius: 10px;
      overflow: hidden;
    }
    .availability-table th, .availability-table td {
      padding: 10px 8px;
      text-align: center;
    }
    .availability-table th {
      background: #e3eafc;
      color: #3f51b5;
      font-weight: 700;
    }
    .availability-table tr:nth-child(even) {
      background: #f4f7fd;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 20px;
      gap: 16px;
      background: #f8fafc;
      border-radius: 12px;
      margin: 20px 0;
      border: 2px dashed #e2e8f0;
    }
    
    .loading-container p {
      margin: 0;
      color: #64748b;
      font-size: 16px;
      font-weight: 500;
    }
    
    .loading-container mat-progress-bar {
      width: 200px;
      border-radius: 4px;
    }
    
    /* Enhanced Search Box Styles */
    .search-box {
      margin: 20px 0;
      padding: 20px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    
    .search-box mat-form-field {
      width: 100%;
      max-width: 400px;
    }
    
    .search-box input {
      font-size: 14px;
      color: #374151;
    }
    
    .search-box input::placeholder {
      color: #9ca3af;
    }
    
    .search-box .mat-icon-button {
      color: #6b7280;
      transition: all 0.2s ease;
    }
    
    .search-box .mat-icon-button:hover {
      color: #3f51b5;
      background: rgba(63, 81, 181, 0.1);
      border-radius: 50%;
    }
    
    .search-box .mat-icon-button[matTooltip="بحث"] {
      color: #3f51b5;
    }
    
    .search-box .mat-icon-button[matTooltip="مسح البحث"] {
      color: #ef4444;
    }
    
    .search-box .mat-icon-button[matTooltip="مسح البحث"]:hover {
      color: #dc2626;
      background: rgba(239, 68, 68, 0.1);
    }
    
    /* Search Results Styling */
    .search-results-info {
      margin: 10px 0;
      padding: 8px 12px;
      background: #e3f2fd;
      border-radius: 4px;
      color: #1976d2;
      font-size: 13px;
    }
    
    /* Header Actions Styling */
    .appointments-header {
      margin-bottom: 20px;
    }
    
    .header-actions {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    
    .action-button {
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .action-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .action-button mat-icon {
      margin-left: 8px;
    }
    
    /* Enhanced Table Styling */
    .appointments-table {
      margin-top: 20px;
    }
    
    .appointments-table table {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .appointments-table th {
      background: linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%);
      color: white;
      font-weight: 600;
      padding: 16px 12px;
      font-size: 14px;
    }
    
    .appointments-table td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .appointments-table tr:hover {
      background: #f8fafc;
    }
    
    .appointments-table tr:nth-child(even) {
      background: #f9fafb;
    }
    
    .appointments-table tr:nth-child(even):hover {
      background: #f1f5f9;
    }
    
    /* Status Chip Enhancement */
    .appointments-table mat-chip {
      font-weight: 500;
      border-radius: 16px;
      padding: 4px 12px;
    }
    
    /* Action Buttons Enhancement */
    .appointments-table .mat-icon-button {
      margin: 0 2px;
      transition: all 0.2s ease;
    }
    
    .appointments-table .mat-icon-button:hover {
      transform: scale(1.1);
    }
    
    /* Paginator Enhancement */
    .appointments-table mat-paginator {
      border-radius: 0 0 12px 12px;
      background: #f8fafc;
      border-top: 1px solid #e5e7eb;
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .search-box {
        padding: 15px;
        margin: 15px 0;
      }
      
      .search-box mat-form-field {
        max-width: 100%;
      }
      
      .header-actions {
        flex-direction: column;
        gap: 8px;
      }
      
      .action-button {
        width: 100%;
      }
      
      .appointments-table table {
        font-size: 12px;
      }
      
      .appointments-table th,
      .appointments-table td {
        padding: 8px 6px;
      }
    }

    /* توحيد ستايل الجداول */
    .custom-table {
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.07);
      background: #fff;
      margin-top: 12px;
    }
    .custom-table th {
      background: #3f51b5;
      color: #fff;
      font-weight: bold;
      font-size: 16px;
      padding: 14px 8px;
    }
    .custom-table td {
      font-size: 15px;
      padding: 14px 8px;
    }
    .custom-table tr {
      transition: background 0.2s;
    }
    .custom-table tr:hover {
      background: #f0f4ff;
    }

    /* أزرار الإجراءات */
    .custom-table .action-btn {
      margin: 0 2px;
      border-radius: 50%;
      min-width: 36px;
      width: 36px;
      height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    /* شريط البحث الكبير والمرتب */
    .pro-search {
      margin: 0 0 18px 0;
      display: flex;
      justify-content: flex-start;
      background: transparent !important;
      box-shadow: none !important;
    }
    .custom-search-bar {
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 500px;
      background: #f5f8ff;
      border: none;
      border-radius: 999px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.07);
      padding: 0 12px;
      height: 54px;
      margin: 0;
    }
    .custom-search-bar input {
      border: none;
      outline: none;
      background: transparent;
      flex: 1;
      font-size: 20px;
      padding: 0 12px;
      border-radius: 999px;
    }
    .search-icon-btn, .clear-icon-btn {
      background: none;
      border: none;
      outline: none;
      cursor: pointer;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .search-icon-btn:hover, .clear-icon-btn:hover {
      background: #e3e8f0;
    }
    .custom-search-bar mat-icon {
      font-size: 28px;
      color: #3f51b5;
    }
    .custom-search-bar input::placeholder {
      color: #b0b3b8;
      opacity: 1;
      font-size: 18px;
    }
  .search {
    display: block;
    width: 100%;
    max-width: 500px;
    margin: 24px auto 18px auto;
    cursor: pointer;
    opacity: 0.9;
    transition: opacity .3s;
    position: relative;
  }
  .search:focus-within { opacity: 1; }

  .one, .two, .three {
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
  }
  .one {
    border-radius: 999px 0 0 999px;
    background: #fff;
    border: 2px solid #3f51b5;
    border-right: none;
    height: 56px;
    z-index: 2;
  }
  .two {
    border-radius: 0 999px 999px 0;
    background: #fff;
    border: 2px solid #3f51b5;
    border-left: none;
    height: 56px;
    position: relative;
    z-index: 2;
  }
  .three {
    flex: 1;
    height: 100%;
    overflow: hidden;
  }
  .four {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    font-size: 20px;
    padding: 0 20px;
    outline: none;
    color: #222;
  }
  .four::placeholder {
    color: #b0b3b8;
    opacity: 1;
    font-size: 18px;
  }
  .stick {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    background: #3f51b5;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .stick:after {
    content: '\u2715'; /* X icon */
    color: #fff;
    font-size: 18px;
  }
  .search:before {
    content: '';
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid #3f51b5;
  }
  .search:after {
    content: '';
    position: absolute;
    left: 32px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    width: 12px;
    height: 2px;
    background: #3f51b5;
    border-radius: 2px;
  }
  `
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  Math = Math;
  loading = false;
  // فصل متغيرات البحث
  searchAppointmentQuery = '';
  searchUserQuery = '';
  private searchAppointmentTimeout: any;
  private searchUserTimeout: any;

  // Data sources
  appointments: any[] = [];
  sliderImages: any[] = [];
  users: any[] = [];
  dashboardStats: DashboardStats | null = null;
  contactMessages: any[] = [];

  // Table data
  appointmentColumns = ['patientName', 'phone', 'date', 'time', 'status', 'actions'];
  userColumns = ['avatar', 'name', 'email', 'role', 'status', 'actions'];

  // Quick stats
  quickStats = [
    {
      label: 'إجمالي الحجوزات',
      value: '0',
      change: 0,
      icon: 'event',
      color: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)'
    },
    {
      label: 'الحجوزات اليوم',
      value: '0',
      change: 0,
      icon: 'today',
      color: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
    },
    {
      label: 'المرضى الجدد',
      value: '0',
      change: 0,
      icon: 'person_add',
      color: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
    },
    {
      label: 'الإيرادات',
      value: '0 د.أ',
      change: 0,
      icon: 'attach_money',
      color: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)'
    }
  ];

  recentAppointments: BookingOut[] = [];
  showAllRecent: boolean = false;

  weekdays = [
    { value: 'sunday', label: 'الأحد' },
    { value: 'monday', label: 'الإثنين' },
    { value: 'tuesday', label: 'الثلاثاء' },
    { value: 'wednesday', label: 'الأربعاء' },
    { value: 'thursday', label: 'الخميس' },
    { value: 'friday', label: 'الجمعة' },
    { value: 'saturday', label: 'السبت' },
  ];
  selectedDay = '';
  startTime = '';
  endTime = '';
  availability: any[] = [];
  
  // Edit appointment variables
  editingAppointment: BookingOut | null = null;
  editForm: FormGroup;

  apiUrl = 'http://localhost:8000';

  // Add property for polling interval
  pollingInterval: any;
  clinicInfoForm: FormGroup;
  savingClinicInfo = false;

  constructor(
    private clinicService: ClinicService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.editForm = this.fb.group({
      date: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      status: ['', Validators.required]
    });
    this.clinicInfoForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Check if user is authenticated and is admin
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (!token || !userData) {
      this.snackBar.open('يجب تسجيل الدخول أولاً', 'إغلاق', { duration: 3000 });
      window.location.href = '/login';
      return;
    }
    
    try {
      const user = JSON.parse(userData);
      if (user.role !== 'admin') {
        this.snackBar.open('غير مصرح لك بالوصول إلى لوحة الإدارة', 'إغلاق', { duration: 3000 });
        window.location.href = '/login';
        return;
      }
    } catch (error) {
      this.snackBar.open('خطأ في بيانات المستخدم', 'إغلاق', { duration: 3000 });
      window.location.href = '/login';
      return;
    }
    
    this.loadDashboardData();
    this.loadAvailability();
    this.loadClinicInfo();
    // لا تحمل رسائل التواصل هنا
    // this.loadContactMessages();
    this.pollingInterval = setInterval(() => {
      this.loadDashboardData();
    }, 30000);
  }

  ngOnDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  loadDashboardData() {
    this.loading = true;
    
    // Load dashboard stats
    this.clinicService.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
        this.updateQuickStats(stats);
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.snackBar.open('خطأ في تحميل إحصائيات لوحة التحكم', 'إغلاق', { duration: 3000 });
  }
    });

    // Load appointments
    this.reloadAppointments();

    // Load slider images
    this.clinicService.getSliderImages().subscribe({
      next: (images) => {
        this.sliderImages = images;
      },
      error: (error) => {
        console.error('Error loading slider images:', error);
        this.snackBar.open('خطأ في تحميل صور السلايدر', 'إغلاق', { duration: 3000 });
      }
    });

    // Load users
    this.reloadUsers();
  }

  updateQuickStats(stats: DashboardStats) {
    this.quickStats[0].value = stats.totalAppointments.toString();
    this.quickStats[1].value = stats.todayAppointments.toString();
    this.quickStats[2].value = stats.newPatients.toString();
    this.quickStats[3].value = `${stats.revenue} د.أ`;
  }

  // Appointment actions
  confirmAppointment(appointment: BookingOut) {
    this.clinicService.confirmAppointment(appointment.id).subscribe({
      next: () => {
        this.snackBar.open('تم تأكيد الحجز بنجاح', 'إغلاق', { duration: 3000 });
        this.loadDashboardData();
      },
      error: (error) => {
        this.snackBar.open('خطأ في تأكيد الحجز', 'إغلاق', { duration: 3000 });
      }
    });
  }

  cancelAppointment(appointment: BookingOut) {
    this.clinicService.cancelAppointment(appointment.id).subscribe({
      next: () => {
        this.snackBar.open('تم إلغاء الحجز بنجاح', 'إغلاق', { duration: 3000 });
        this.loadDashboardData();
      },
      error: (error) => {
        this.snackBar.open('خطأ في إلغاء الحجز', 'إغلاق', { duration: 3000 });
      }
    });
  }

  deleteAppointment(appointment: BookingOut) {
    if (confirm('هل أنت متأكد من حذف هذا الحجز؟')) {
      this.clinicService.deleteAppointment(appointment.id).subscribe({
        next: () => {
          this.snackBar.open('تم حذف الحجز بنجاح', 'إغلاق', { duration: 3000 });
          this.loadDashboardData();
        },
        error: (error) => {
          this.snackBar.open('خطأ في حذف الحجز', 'إغلاق', { duration: 3000 });
        }
      });
    }
  }

  // Search appointments
  searchAppointments() {
    if (this.searchAppointmentQuery.trim()) {
      this.loading = true;
      this.clinicService.searchAppointments(this.searchAppointmentQuery).subscribe({
        next: (appointments) => {
          this.appointments = appointments;
          this.loading = false;
          this.updateRecentAppointments();
          if (appointments.length === 0) {
            this.snackBar.open('لم يتم العثور على نتائج', 'إغلاق', { duration: 2000 });
          }
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('خطأ في البحث', 'إغلاق', { duration: 3000 });
        }
      });
    } else {
      this.reloadAppointments();
    }
  }

  clearSearchAppointments() {
    this.searchAppointmentQuery = '';
    this.reloadAppointments();
  }

  onSearchInputAppointments() {
    if (this.searchAppointmentTimeout) clearTimeout(this.searchAppointmentTimeout);
    if (this.searchAppointmentQuery.trim().length >= 2) {
      this.searchAppointmentTimeout = setTimeout(() => {
        this.searchAppointments();
      }, 500);
    } else if (this.searchAppointmentQuery.trim().length === 0) {
      this.reloadAppointments();
    }
  }

  reloadAppointments() {
    this.loading = true;
    this.clinicService.getAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.updateRecentAppointments();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // Slider actions
  addSliderImage() {
    const dialogRef = this.dialog.open(AddSliderImageDialogComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe((formData: FormData) => {
      if (formData) {
        this.clinicService.addSliderImage(formData).subscribe({
          next: () => {
            this.snackBar.open('تمت إضافة الصورة بنجاح', 'إغلاق', { duration: 3000 });
            this.loadDashboardData();
          },
          error: () => {
            this.snackBar.open('حدث خطأ أثناء رفع الصورة', 'إغلاق', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteSliderImage(image: SliderImage) {
    if (confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
      this.clinicService.deleteSliderImage(image.id).subscribe({
        next: () => {
          this.snackBar.open('تم حذف الصورة بنجاح', 'إغلاق', { duration: 3000 });
          this.loadDashboardData();
        },
        error: (error) => {
          this.snackBar.open('خطأ في حذف الصورة', 'إغلاق', { duration: 3000 });
        }
      });
    }
  }

  // User actions
  deleteUser(user: User) {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      this.clinicService.deleteUser(user.id).subscribe({
        next: () => {
          this.snackBar.open('تم حذف المستخدم بنجاح', 'إغلاق', { duration: 3000 });
          this.loadDashboardData();
        },
        error: (error) => {
          this.snackBar.open('خطأ في حذف المستخدم', 'إغلاق', { duration: 3000 });
        }
      });
    }
  }

  // Placeholder for user edit functionality
  editUser(user: any) {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '400px',
      data: { user }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clinicService.updateUser(user.id, result).subscribe({
          next: () => {
            this.snackBar.open('تم تحديث المستخدم بنجاح', 'إغلاق', { duration: 3000 });
            this.loadDashboardData();
          },
          error: () => {
            this.snackBar.open('حدث خطأ أثناء تحديث المستخدم', 'إغلاق', { duration: 3000 });
          }
        });
      }
    });
  }

  // Helper methods for status
  getStatusColor(status: string): string {
    switch (status) {
      case 'confirmed': return 'primary';
      case 'pending': return 'warn';
      case 'cancelled': return 'accent';
      case 'completed': return 'primary';
      case 'booked': return 'primary';
      default: return 'warn';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'confirmed': return 'مؤكد';
      case 'pending': return 'في الانتظار';
      case 'cancelled': return 'ملغي';
      case 'completed': return 'مكتمل';
      case 'booked': return 'محجوز';
      default: return 'غير معروف';
    }
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'admin': return 'primary';
      case 'doctor': return 'accent';
      case 'nurse': return 'warn';
      case 'user': return 'accent';
      default: return 'accent';
    }
  }

  getRoleText(role: string): string {
    switch (role) {
      case 'admin': return 'مدير';
      case 'doctor': return 'طبيب';
      case 'nurse': return 'ممرض/ة';
      case 'user': return 'مستخدم';
      default: return 'غير معروف';
    }
  }

  addTimeRange() {
    if (!this.selectedDay || !this.startTime || !this.endTime) return;
    // تحقق أن النهاية بعد البداية
    if (this.startTime >= this.endTime) {
      this.snackBar.open('وقت النهاية يجب أن يكون بعد وقت البداية', 'إغلاق', { duration: 3000 });
      return;
    }
    // تحويل الوقت من 24 ساعة إلى 12 ساعة
    const startTime12 = this.convertTo12HourFormat(this.startTime);
    const endTime12 = this.convertTo12HourFormat(this.endTime);
    
    // إرسال للباكند
    const payload = {
      weekday: this.selectedDay,
      start_time: startTime12,
      end_time: endTime12
    };
    this.clinicService.createAvailability(payload).subscribe({
      next: () => {
        this.snackBar.open('تمت إضافة الفترة بنجاح', 'إغلاق', { duration: 2000 });
        this.loadAvailability();
        this.startTime = '';
        this.endTime = '';
      },
      error: () => {
        this.snackBar.open('حدث خطأ أثناء الإضافة', 'إغلاق', { duration: 3000 });
      }
    });
  }

  // Helper method to convert 24-hour format to 12-hour format
  convertTo12HourFormat(time24: string): string {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  loadAvailability() {
    this.clinicService.getAvailability().subscribe({
      next: (data) => { this.availability = data; },
      error: () => { this.availability = []; }
    });
  }

  deleteTimeRange(id: number) {
    this.clinicService.deleteAvailability(id).subscribe({
      next: () => {
        this.snackBar.open('تم حذف الفترة', 'إغلاق', { duration: 2000 });
        this.loadAvailability();
      },
      error: () => {
        this.snackBar.open('حدث خطأ أثناء الحذف', 'إغلاق', { duration: 3000 });
      }
    });
  }

  getDayLabel(day: string) {
    const found = this.weekdays.find(d => d.value === day);
    return found ? found.label : day;
  }

  // Edit appointment
  editAppointment(appointment: BookingOut) {
    this.editingAppointment = appointment;
    this.editForm.patchValue({
      date: appointment.date,
      start_time: appointment.start_time,
      end_time: appointment.end_time,
      status: appointment.status
    });
    
    // Show edit dialog
    this.showEditDialog();
  }

  showEditDialog() {
    const dialogRef = this.dialog.open(EditAppointmentDialogComponent, {
      width: '500px',
      data: {
        appointment: this.editingAppointment,
        form: this.editForm
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveAppointmentEdit(result);
      }
      this.editingAppointment = null;
    });
  }

  saveAppointmentEdit(updatedData: any) {
    if (!this.editingAppointment) return;

    this.clinicService.updateAppointment(this.editingAppointment.id, updatedData).subscribe({
      next: () => {
        this.snackBar.open('تم تحديث الحجز بنجاح', 'إغلاق', { duration: 3000 });
        this.loadDashboardData();
      },
      error: (error) => {
        this.snackBar.open('خطأ في تحديث الحجز', 'إغلاق', { duration: 3000 });
      }
    });
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return this.apiUrl + imageUrl;
  }

  // Add a method to toggle showing all recent bookings
  toggleShowAllRecent() {
    this.showAllRecent = !this.showAllRecent;
    this.updateRecentAppointments();
  }

  // Refactor to update recentAppointments based on showAllRecent
  updateRecentAppointments() {
    const newBookings = this.appointments
      .filter(a => a.status === 'pending' || a.status === 'booked')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    this.recentAppointments = this.showAllRecent ? newBookings : newBookings.slice(0, 3);
  }

  editSliderImage(slide: SliderImage) {
    const dialogRef = this.dialog.open(AddSliderImageDialogComponent, {
      width: '400px',
      data: slide
    });
    dialogRef.afterClosed().subscribe((formData: FormData) => {
      if (formData) {
        this.clinicService.updateSliderImage(slide.id, formData).subscribe({
          next: () => {
            this.snackBar.open('تم تعديل الصورة بنجاح', 'إغلاق', { duration: 3000 });
            this.loadDashboardData();
          },
          error: () => {
            this.snackBar.open('حدث خطأ أثناء تعديل الصورة', 'إغلاق', { duration: 3000 });
          }
        });
      }
    });
  }

  logout() {
    // امسح التوكن وبيانات المستخدم من التخزين المحلي
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    // أعد التوجيه لصفحة تسجيل الدخول
    window.location.href = '/login';
  }

  canEditUser(user: User): boolean {
    // عدل هذا الشرط حسب منطقك (مثلاً: لا تعدل الأدمن)
    return user.role !== 'admin';
  }

  // Search users
  searchUsers() {
    if (this.searchUserQuery.trim()) {
      this.loading = true;
      this.clinicService.searchUsers(this.searchUserQuery).subscribe({
        next: (users) => {
          this.users = users;
          this.loading = false;
          if (users.length === 0) {
            this.snackBar.open('لم يتم العثور على نتائج', 'إغلاق', { duration: 2000 });
          }
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('خطأ في البحث', 'إغلاق', { duration: 3000 });
        }
      });
    } else {
      this.reloadUsers();
    }
  }

  clearSearchUsers() {
    this.searchUserQuery = '';
    this.reloadUsers();
  }

  onSearchInputUsers() {
    if (this.searchUserTimeout) clearTimeout(this.searchUserTimeout);
    if (this.searchUserQuery.trim().length >= 2) {
      this.searchUserTimeout = setTimeout(() => {
        this.searchUsers();
      }, 500);
    } else if (this.searchUserQuery.trim().length === 0) {
      this.reloadUsers();
    }
  }

  reloadUsers() {
    this.loading = true;
    this.clinicService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadClinicInfo() {
    this.clinicService.getClinicInfo().subscribe({
      next: (info: any) => {
        this.clinicInfoForm.patchValue({
          name: info.name || '',
          phone: info.phone || '',
          email: info.email || '',
          address: info.address || ''
        });
      },
      error: (err) => {
        this.snackBar.open('تعذر تحميل بيانات العيادة', 'إغلاق', { duration: 3000 });
      }
    });
  }

  saveClinicInfo() {
    if (this.clinicInfoForm.invalid) return;
    this.savingClinicInfo = true;
    this.clinicService.saveClinicInfo(this.clinicInfoForm.value).subscribe({
      next: () => {
        this.snackBar.open('تم حفظ بيانات العيادة بنجاح', 'إغلاق', { duration: 3000 });
        this.savingClinicInfo = false;
      },
      error: () => {
        this.snackBar.open('حدث خطأ أثناء حفظ البيانات', 'إغلاق', { duration: 3000 });
        this.savingClinicInfo = false;
      }
    });
  }

  // تحميل رسائل التواصل عند فتح التبويب فقط
  onTabChange(event: any) {
    // event.index: رقم التبويب
    // لنفترض أن تبويب رسائل التواصل هو الأخير
    if (event.index === 5) {
      this.loadContactMessages();
    }
  }

  loadContactMessages() {
    this.clinicService.getContactMessages().subscribe({
      next: (messages: any) => {
        this.contactMessages = Array.isArray(messages) ? messages : [];
      },
      error: () => {
        this.contactMessages = [];
      }
    });
  }
} 