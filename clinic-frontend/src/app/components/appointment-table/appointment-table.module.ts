import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { AppointmentTableComponent } from './appointment-table.component';

@NgModule({
  declarations: [AppointmentTableComponent],
  imports: [
    CommonModule,
    MatTableModule
  ],
  exports: [AppointmentTableComponent]
})
export class AppointmentTableModule {} 