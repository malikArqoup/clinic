import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-slider-image-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  template: `
    <div dir="rtl" style="min-width:340px;max-width:400px;padding:8px 0;">
      <h2 mat-dialog-title style="margin-bottom:20px;text-align:center;font-weight:700;">إضافة صورة جديدة للسلايدر</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" enctype="multipart/form-data" style="display:flex;flex-direction:column;gap:16px;">
        <mat-form-field appearance="outline" style="width:100%;">
          <mat-label>العنوان (اختياري)</mat-label>
          <input matInput formControlName="title" placeholder="أدخل عنوان للصورة (اختياري)">
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%;">
          <mat-label>الوصف (اختياري)</mat-label>
          <textarea matInput formControlName="text" placeholder="أدخل وصف للصورة (اختياري)" rows="2"></textarea>
        </mat-form-field>
        <div style="display:flex;align-items:center;gap:12px;">
          <button mat-stroked-button color="primary" type="button" (click)="fileInput.click()">
            <mat-icon>upload</mat-icon> اختر صورة
          </button>
          <input #fileInput type="file" (change)="onFileChange($event)" accept="image/*" hidden>
          <span *ngIf="file" style="font-size:0.95em;">{{ file.name }}</span>
        </div>
        <div *ngIf="filePreview" style="text-align:center;margin:8px 0;">
          <img [src]="filePreview" alt="معاينة" style="max-width:100%;max-height:140px;border-radius:8px;box-shadow:0 2px 8px #0001;">
        </div>
        <div mat-dialog-actions style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;">
          <button mat-raised-button color="primary" type="submit" [disabled]="!file">إضافة</button>
          <button mat-button mat-dialog-close type="button">إلغاء</button>
        </div>
      </form>
    </div>
  `
})
export class AddSliderImageDialogComponent {
  form: FormGroup;
  file: File | null = null;
  filePreview: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<AddSliderImageDialogComponent>,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      text: ['']
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.file = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.filePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (!this.file || !this.form.value.title) return;
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('title', this.form.value.title);
    formData.append('text', this.form.value.text || '');
    formData.append('order', '0');
    formData.append('is_active', 'true');
    formData.append('is_active', '1');
    this.dialogRef.close(formData);
  }
} 