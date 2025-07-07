import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AppointmentTableModule } from '../appointment-table/appointment-table.module';
import { MatTableModule } from '@angular/material/table';
import { AddSliderImageDialogComponent } from './add-slider-image-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [AdminDashboardComponent, AddSliderImageDialogComponent],
  imports: [
    CommonModule,
    AppointmentTableModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AdminDashboardModule {} 