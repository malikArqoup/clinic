import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-times',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="booking-available-card">
      <div class="booking-available-title">الأيام والأوقات المتاحة للحجز</div>
      <table class="booking-available-table">
        <thead>
          <tr>
            <th>اليوم</th>
            <th>الفترات المتاحة</th>
            <th>إجراء</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let day of workTimes">
            <td class="day">{{ day.label }}</td>
            <td class="time">{{ day.start }} - {{ day.end }}</td>
            <td class="action">
              <button class="big-book-btn" (click)="onBook(day)">
                <span class="material-icons">event_available</span>
                احجز
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .booking-available-card {
      background: #fff;
      border-radius: 24px;
      box-shadow: 0 8px 32px rgba(63, 81, 181, 0.13);
      padding: 36px 32px;
      max-width: 520px;
      margin: 0 auto 48px auto;
      text-align: center;
    }
    .booking-available-title {
      color: #283593;
      font-weight: 800;
      margin-bottom: 28px;
      font-size: 1.5rem;
      letter-spacing: 1px;
    }
    .booking-available-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0 18px;
      font-size: 1.18rem;
    }
    .booking-available-table th,
    .booking-available-table td {
      padding: 18px 14px;
      background: #f5f7fa;
      border-radius: 14px;
      font-weight: 600;
    }
    .booking-available-table th {
      background: transparent;
      color: #3f51b5;
      font-size: 1.13rem;
      border-radius: 0;
    }
    .booking-available-table td.day {
      color: #222;
      font-weight: 700;
      font-size: 1.13rem;
    }
    .booking-available-table td.time {
      color: #3f51b5;
      font-weight: 600;
      font-size: 1.13rem;
    }
    .booking-available-table td.action {
      text-align: left;
    }
    .big-book-btn {
      font-size: 1.13rem;
      font-weight: 700;
      padding: 16px 40px;
      border-radius: 32px;
      background: linear-gradient(90deg, #3f51b5 0%, #2196f3 100%);
      color: #fff !important;
      box-shadow: 0 4px 16px rgba(33, 150, 243, 0.13);
      border: none;
      outline: none;
      transition: all 0.22s cubic-bezier(.4,2,.3,1);
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    .big-book-btn:hover, .big-book-btn:focus {
      transform: scale(1.05) translateY(-2px);
      box-shadow: 0 8px 32px rgba(33, 150, 243, 0.18);
      background: linear-gradient(90deg, #2196f3 0%, #3f51b5 100%);
      color: #fff;
    }
    .big-book-btn .material-icons {
      font-size: 1.5rem;
      margin-left: 8px;
      color: #fff;
    }
    @media (max-width: 600px) {
      .booking-available-card { max-width: 98vw; padding: 12px 2px; }
      .booking-available-title { font-size: 1.1rem; }
    }
  `]
})
export class BookingTimesComponent {
  workTimes = [
    { label: 'الأحد', start: '9:00 AM', end: '3:00 PM' },
    { label: 'الإثنين', start: '9:00 AM', end: '3:00 PM' },
    { label: 'الثلاثاء', start: '9:00 AM', end: '3:00 PM' },
    { label: 'الأربعاء', start: '9:00 AM', end: '3:00 PM' },
    { label: 'الخميس', start: '9:00 AM', end: '3:00 PM' },
    { label: 'الجمعة', start: 'مغلق', end: '' },
    { label: 'السبت', start: 'مغلق', end: '' },
  ];

  onBook(day: any) {
    alert('تم اختيار يوم: ' + day.label + ' من ' + day.start + ' إلى ' + day.end);
  }
} 