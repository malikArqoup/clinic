import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../services/clinic.service';

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="edit-dialog">
      <h2 mat-dialog-title>تعديل المستخدم</h2>
      <mat-dialog-content>
        <form [formGroup]="form" class="edit-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>الاسم</mat-label>
            <input matInput formControlName="name" required>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>البريد الإلكتروني</mat-label>
            <input matInput formControlName="email" required>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>رقم الهاتف</mat-label>
            <input matInput formControlName="phone_number">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>الدور</mat-label>
            <mat-select formControlName="role" required>
              <mat-option value="admin">مدير</mat-option>
              <mat-option value="patient">مستخدم</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>الحالة</mat-label>
            <mat-select formControlName="status" required>
              <mat-option value="active">نشط</mat-option>
              <mat-option value="inactive">غير نشط</mat-option>
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
export class EditUserDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: [data.user.name, Validators.required],
      email: [data.user.email, [Validators.required, Validators.email]],
      phone_number: [data.user.phone_number],
      role: [data.user.role, Validators.required],
      status: [data.user.status || 'active', Validators.required]
    });
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