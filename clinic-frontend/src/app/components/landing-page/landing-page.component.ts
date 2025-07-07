import { Component, OnInit, HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { SliderComponent } from '../slider/slider.component';
import { AboutComponent } from '../about/about.component';
import { ContactUsComponent } from '../contact-us/contact-us.component';
import { BookingFormComponent } from '../booking-form/booking-form.component';
import { ClinicService } from '../../services/clinic.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { MatOptionModule } from '@angular/material/core';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    NavBarComponent,
    SliderComponent,
    AboutComponent,
    ContactUsComponent,
    BookingFormComponent,
  ],
  template: `
    <app-nav-bar></app-nav-bar>
    
    <!-- Hero Section with Parallax -->
    <section class="hero-section" id="home">
      <div class="hero-background">
        <div class="parallax-layer layer-1"></div>
        <div class="parallax-layer layer-2"></div>
        <div class="parallax-layer layer-3"></div>
      </div>
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title" [class.animate]="isVisible">
            <span class="title-line">مرحباً بكم في</span>
            <span class="title-highlight">عيادة الشفاء</span>
          </h1>
          <p class="hero-subtitle" [class.animate]="isVisible">
            نقدم لكم أفضل رعاية طبية بأحدث الأجهزة وأمهر الأطباء المتخصصين
          </p>
          <div class="hero-buttons" [class.animate]="isVisible">
            <button class="primary-btn" (click)="scrollToBooking()">
              <mat-icon>schedule</mat-icon>
              احجز موعدك الآن
            </button>
            <button class="secondary-btn" (click)="scrollToAbout()">
              <mat-icon>info</mat-icon>
              تعرف علينا
            </button>
          </div>
        </div>
        <div class="hero-visual" [class.animate]="isVisible">
          <div class="floating-card card-1">
            <mat-icon>medical_services</mat-icon>
            <span>رعاية طبية متكاملة</span>
          </div>
          <div class="floating-card card-2">
            <mat-icon>schedule</mat-icon>
            <span>حجز سريع وسهل</span>
          </div>
          <div class="floating-card card-3">
            <mat-icon>people</mat-icon>
            <span>فريق طبي متميز</span>
          </div>
        </div>
      </div>
    </section>
    
    <div class="landing-content">
      <app-slider></app-slider>
      
      <section class="section-divider" [class.animate]="isDividerVisible">
        <div class="divider-line"></div>
        <div class="divider-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
          </svg>
        </div>
        <div class="divider-line"></div>
      </section>

      <!-- جدول الأيام والأوقات المتاحة للحجز -->
      <section id="booking" style="margin: 48px auto; max-width: 700px; direction: rtl;">
        <h2 style="text-align:center; color:#3f51b5; font-weight:700; margin-bottom:18px;">الأيام والأوقات المتاحة للحجز</h2>
        <div class="booking-table-container">
          <table class="booking-table">
            <thead>
              <tr>
                <th>اليوم</th>
                <th>الفترات المتاحة</th>
                <th>إجراء</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let day of availability">
                <td class="day-label">{{ getDayLabel(day.weekday) }}</td>
                <td class="slot-range">{{ day.start_time }} - {{ day.end_time }}</td>
                <td>
                  <button mat-raised-button color="primary" class="book-btn" (click)="openBookingCard(day)">
                    <mat-icon>event_available</mat-icon> احجز
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="section-divider" [class.animate]="isDividerVisible">
        <div class="divider-line"></div>
        <div class="divider-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
          </svg>
        </div>
        <div class="divider-line"></div>
      </section>
      
      <app-about></app-about>
      
      <section class="section-divider" [class.animate]="isDividerVisible">
        <div class="divider-line"></div>
        <div class="divider-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
          </svg>
        </div>
        <div class="divider-line"></div>
      </section>
      
      <app-contact-us></app-contact-us>
    </div>
    
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>عيادة الشفاء</h3>
          <p>نحن نقدم أفضل رعاية طبية لجميع أفراد العائلة</p>
        </div>
        <div class="footer-section">
          <h4>روابط سريعة</h4>
          <ul>
            <li><a href="#booking">الحجز</a></li>
            <li><a href="#about">من نحن</a></li>
            <li><a href="#contact">اتصل بنا</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>معلومات الاتصال</h4>
          <p>📞 0599123456</p>
          <p>📧 info&#64;ramclinic.com</p>
          <p>📍 فلسطين، رام الله</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 عيادة الشفاء. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  `,
  styles: `
    .landing-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      flex-direction: column;
      gap: 0;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      min-height: 100vh;
      margin-top: 80px;
    }
    
    /* Hero Section */
    .hero-section {
      position: relative;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background: linear-gradient(135deg, rgba(63,81,181,0.18) 0%, rgba(156,39,176,0.10) 100%), url('https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1400&q=80') center center/cover no-repeat;
    }
    
    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }
    
    .parallax-layer {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-size: cover;
      background-position: center;
      opacity: 0.1;
    }
    
    .layer-1 {
      background-image: url('https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80');
      animation: float 20s ease-in-out infinite;
    }
    
    .layer-2 {
      background-image: url('https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1200&q=80');
      animation: float 15s ease-in-out infinite reverse;
    }
    
    .layer-3 {
      background-image: url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80');
      animation: float 25s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-20px) rotate(1deg); }
      66% { transform: translateY(10px) rotate(-1deg); }
    }
    
    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: center;
    }
    
    .hero-text {
      text-align: right;
      color: white;
    }
    
    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 24px;
      line-height: 1.2;
    }
    
    .title-line {
      display: block;
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.8s ease;
    }
    
    .title-highlight {
      display: block;
      background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.8s ease 0.2s;
    }
    
    .hero-title.animate .title-line,
    .hero-title.animate .title-highlight {
      opacity: 1;
      transform: translateY(0);
    }
    
    .hero-subtitle {
      font-size: 1.3rem;
      margin-bottom: 32px;
      opacity: 0.9;
      line-height: 1.6;
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.8s ease 0.4s;
    }
    
    .hero-subtitle.animate {
      opacity: 0.9;
      transform: translateY(0);
    }
    
    .hero-buttons {
      display: flex;
      gap: 16px;
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.8s ease 0.6s;
    }
    
    .hero-buttons.animate {
      opacity: 1;
      transform: translateY(0);
    }
    
    .primary-btn,
    .secondary-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px 32px;
      border: none;
      border-radius: 50px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    
    .primary-btn {
      background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
      color: #1e293b;
      box-shadow: 0 8px 24px rgba(255, 215, 0, 0.3);
    }
    
    .primary-btn:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(255, 215, 0, 0.4);
    }
    
    .secondary-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
    }
    
    .secondary-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-4px);
    }
    
    .hero-visual {
      position: relative;
      height: 400px;
      opacity: 0;
      transform: translateX(50px);
      transition: all 0.8s ease 0.8s;
    }
    
    .hero-visual.animate {
      opacity: 1;
      transform: translateX(0);
    }
    
    .floating-card {
      position: absolute;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      padding: 20px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 12px;
      color: #1e293b;
      font-weight: 600;
      animation: float 6s ease-in-out infinite;
    }
    
    .floating-card mat-icon {
      color: #3f51b5;
      font-size: 24px;
    }
    
    .card-1 {
      top: 20px;
      left: 20px;
      animation-delay: 0s;
    }
    
    .card-2 {
      top: 50%;
      right: 20px;
      animation-delay: 2s;
    }
    
    .card-3 {
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      animation-delay: 4s;
    }
    
    .section-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 48px 0;
      padding: 0 16px;
      opacity: 0;
      transform: scale(0.8);
      transition: all 0.6s ease;
    }
    
    .section-divider.animate {
      opacity: 1;
      transform: scale(1);
    }
    
    .divider-line {
      flex: 1;
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, #3f51b5 50%, transparent 100%);
      max-width: 200px;
    }
    
    .divider-icon {
      width: 40px;
      height: 40px;
      background: #3f51b5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 16px;
      color: white;
      box-shadow: 0 4px 12px rgba(63, 81, 181, 0.3);
    }
    
    .divider-icon svg {
      width: 20px;
      height: 20px;
    }
    
    .footer {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      color: white;
      margin-top: 64px;
      padding: 48px 24px 24px 24px;
    }
    
    .footer-content {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 32px;
      margin-bottom: 32px;
    }
    
    .footer-section h3 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 16px;
      color: #60a5fa;
    }
    
    .footer-section h4 {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 16px;
      color: #60a5fa;
    }
    
    .footer-section p {
      line-height: 1.6;
      opacity: 0.9;
      margin-bottom: 8px;
    }
    
    .footer-section ul {
      list-style: none;
      padding: 0;
    }
    
    .footer-section ul li {
      margin-bottom: 8px;
    }
    
    .footer-section ul li a {
      color: white;
      text-decoration: none;
      opacity: 0.9;
      transition: all 0.3s ease;
    }
    
    .footer-section ul li a:hover {
      opacity: 1;
      color: #60a5fa;
      padding-right: 8px;
    }
    
    .footer-bottom {
      text-align: center;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      opacity: 0.8;
    }
    
    @media (max-width: 768px) {
      .landing-content {
        padding: 0 16px;
      }
      
      .hero-content {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 32px;
      }
      
      .hero-title {
        font-size: 2.5rem;
      }
      
      .hero-subtitle {
        font-size: 1.1rem;
      }
      
      .hero-buttons {
        flex-direction: column;
        align-items: center;
      }
      
      .hero-visual {
        height: 300px;
      }
      
      .floating-card {
        padding: 16px;
        font-size: 0.9rem;
      }
      
      .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
      }
      
      .section-divider {
        margin: 32px 0;
      }
    }

    @media (max-width: 600px) {
      .hero-subtitle {
        color: #ffd700 !important;
        font-size: 1.1rem;
        margin-bottom: 12px;
        line-height: 1.5;
        word-break: break-word;
      }
    }

    /* Additional Animation Classes */
    .animate-in {
      animation: slideInUp 0.8s ease-out forwards;
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Hover Effects */
    .floating-card:hover {
      transform: translateY(-10px) scale(1.05);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
    }

    .primary-btn:hover,
    .secondary-btn:hover {
      transform: translateY(-4px) scale(1.05);
    }

    /* Loading Animation */
    .loading-pulse {
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    /* Parallax Effect */
    .parallax-layer {
      will-change: transform;
    }

    /* Smooth Transitions */
    * {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    #booking {
      max-width: 700px;
      margin: 60px auto 48px auto;
      background: #f8fafc;
      border-radius: 24px;
      box-shadow: 0 8px 32px rgba(60, 60, 120, 0.10);
      padding: 32px 0 32px 0;
    }
    .booking-table {
      font-size: 1.25rem;
      min-width: 420px;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      border-radius: 18px;
      box-shadow: 0 6px 32px rgba(60, 60, 120, 0.10);
      background: #fff;
    }
    .booking-table th, .booking-table td {
      padding: 18px 20px;
      text-align: center;
    }
    .booking-table th {
      font-size: 1.15rem;
      font-weight: 800;
      color: #3f51b5;
      background: #f5f7fa;
    }
    .booking-table td {
      font-size: 1.13rem;
    }
    .booking-table .book-btn {
      font-size: 1.1rem;
      padding: 8px 24px;
      border-radius: 10px;
    }
    .day-label {
      font-weight: 700;
      color: #222;
      font-size: 1.1rem;
    }
    .slot-range {
      color: #3f51b5;
      font-weight: 500;
      letter-spacing: 1px;
    }

    .hero-background .parallax-layer {
      background: linear-gradient(135deg, rgba(63, 81, 181, 0.10) 0%, rgba(156, 39, 176, 0.05) 100%) !important;
    }
  `
})
export class LandingPageComponent implements OnInit {
  isVisible = false;
  isDividerVisible = false;
  availability: any[] = [];
  weekdays = [
    { value: 'Monday', label: 'الاثنين' },
    { value: 'Tuesday', label: 'الثلاثاء' },
    { value: 'Wednesday', label: 'الأربعاء' },
    { value: 'Thursday', label: 'الخميس' },
    { value: 'Friday', label: 'الجمعة' },
    { value: 'Saturday', label: 'السبت' },
    { value: 'Sunday', label: 'الأحد' },
  ];

  constructor(private clinicService: ClinicService, private dialog: MatDialog, private fb: FormBuilder, private snackBar: MatSnackBar, private authService: AuthService) {}

  ngOnInit() {
    this.loadAvailability();
    // Trigger initial animations
    setTimeout(() => {
      this.isVisible = true;
    }, 100);

    // Add smooth scroll behavior
    this.addSmoothScroll();
  }

  loadAvailability() {
    this.clinicService.getAvailability().subscribe({
      next: (data) => { 
        console.log('Availability data received:', data);
        this.availability = data; 
      },
      error: (error) => { 
        console.error('Error loading availability:', error);
        this.availability = []; 
      }
    });
  }

  getDayLabel(day: string) {
    const found = this.weekdays.find(d => d.value === day);
    return found ? found.label : day;
  }

  openBookingCard(day: any) {
    // Debug: Log the day object to see its structure
    console.log('Opening booking card for day:', day);
    
    const dialogRef = this.dialog.open(BookingDialog, {
      data: {
        ...day,
        getDayLabel: this.getDayLabel.bind(this),
        formatDate: this.formatDate.bind(this),
        getNextDateForWeekday: this.getNextDateForWeekday.bind(this)
      },
      width: '380px',
      autoFocus: false
    });

    // Refresh availability data after dialog closes
    dialogRef.afterClosed().subscribe(() => {
      // Reload availability to reflect any changes
      this.loadAvailability();
    });
  }

  addSmoothScroll() {
    // Add smooth scrolling to all anchor links
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const href = target.getAttribute('href');
        if (href) {
          this.scrollToElement(href);
        }
      }
    });
  }

  scrollToElement(selector: string) {
    const element = document.querySelector(selector);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  }

  scrollToBooking() {
    this.scrollToElement('#booking');
  }

  scrollToAbout() {
    this.scrollToElement('#about');
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Check if dividers are visible
    const dividers = document.querySelectorAll('.section-divider');
    dividers.forEach((divider, index) => {
      const rect = divider.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8) {
        setTimeout(() => {
          this.isDividerVisible = true;
        }, index * 200);
      }
    });

    // Add scroll-triggered animations for components
    this.animateOnScroll();
  }

  animateOnScroll() {
    // Animate elements when they come into view
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe all components that should animate
    const animatedElements = document.querySelectorAll('.booking-section, .about-section, .contact-section');
    animatedElements.forEach(el => {
      observer.observe(el);
    });
  }

  formatDate(date: Date): string {
    // yyyy-mm-dd
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  getNextDateForWeekday(weekday: string): string {
    // Normalize weekday to capitalized format
    const normalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1).toLowerCase();
    
    const daysMap: any = {
      'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4,
      'Friday': 5, 'Saturday': 6, 'Sunday': 0
    };
    const today = new Date();
    const todayDay = today.getDay();
    const targetDay = daysMap[normalizedWeekday];
    
    if (targetDay === undefined) {
      console.error('Invalid weekday:', weekday, 'Normalized:', normalizedWeekday);
      return 'NaN-NaN-NaN';
    }
    
    let diff = targetDay - todayDay;
    if (diff < 0) diff += 7;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + diff);
    const month = (nextDate.getMonth() + 1).toString().padStart(2, '0');
    const day = nextDate.getDate().toString().padStart(2, '0');
    return `${nextDate.getFullYear()}-${month}-${day}`;
  }
}

// استبدل BookingDialogPlaceholder بمكون حجز كامل
@Component({
  selector: 'booking-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="booking-dialog-modern">
      <h3 class="booking-title">
        حجز موعد ليوم <span class="booking-day">{{ data.getDayLabel(data.weekday) }}</span>
      </h3>
      <form [formGroup]="form" (ngSubmit)="submit()" class="booking-form">
        <mat-form-field appearance="outline">
          <mat-label>الاسم الكامل</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>البريد الإلكتروني</mat-label>
          <input matInput formControlName="email" required type="email">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>رقم الهاتف</mat-label>
          <input matInput formControlName="phone" required>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>اختر الوقت</mat-label>
          <mat-select formControlName="slot" required>
            <mat-option *ngFor="let slot of slots" [value]="slot">{{ slot }}</mat-option>
          </mat-select>
        </mat-form-field>
        <div *ngIf="slots.length === 0" class="no-slots-msg">
          لا توجد أوقات متاحة للحجز في هذا اليوم
        </div>
        <button mat-raised-button color="primary" class="confirm-btn"
                type="submit" [disabled]="form.invalid || slots.length === 0">
          {{ slots.length === 0 ? 'لا توجد أوقات متاحة' : 'تأكيد الحجز' }}
        </button>
        <button mat-button type="button" class="cancel-btn" (click)="dialogRef.close()">إلغاء</button>
      </form>
    </div>
  `,
  styles: `
    .booking-dialog-modern {
      background: #fff;
      border-radius: 32px;
      box-shadow: 0 12px 40px rgba(60, 60, 120, 0.13);
      padding: 38px 22px 22px 22px;
      max-width: 410px;
      margin: 0 auto;
      font-family: 'Cairo', 'Tajawal', Arial, sans-serif;
      transition: box-shadow 0.3s;
    }
    .booking-title {
      text-align: center;
      color: #3f51b5;
      font-weight: 800;
      margin-bottom: 22px;
      font-size: 1.35rem;
      letter-spacing: 0.5px;
    }
    .booking-day {
      color: #ff9800;
      font-weight: 900;
      font-size: 1.1em;
    }
    .booking-form {
      display: flex;
      flex-direction: column;
      gap: 22px;
    }
    .mat-form-field {
      width: 100%;
      border-radius: 18px !important;
    }
    .mat-form-field-appearance-outline .mat-form-field-outline {
      border-radius: 18px !important;
    }
    .mat-input-element, .mat-select-trigger {
      border-radius: 18px !important;
      background: #f8fafc !important;
    }
    .confirm-btn {
      margin-top: 12px;
      font-weight: 700;
      border-radius: 18px;
      font-size: 1.13rem;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 8px rgba(63,81,181,0.08);
      background: linear-gradient(90deg, #3f51b5 60%, #ff9800 100%);
      color: #fff;
      transition: background 0.2s, box-shadow 0.2s;
    }
    .confirm-btn:hover {
      background: linear-gradient(90deg, #ff9800 0%, #3f51b5 100%);
      box-shadow: 0 4px 16px rgba(63,81,181,0.13);
    }
    .cancel-btn {
      color: #888 !important;
      font-weight: 600;
      margin-top: 0;
      border-radius: 12px;
      transition: background 0.2s;
    }
    .cancel-btn:hover {
      background: #f5f5f5;
    }
    .no-slots-msg {
      text-align: center;
      color: #f44336;
      background: #ffebee;
      border-radius: 10px;
      padding: 12px;
      font-size: 1rem;
      margin-bottom: 8px;
    }
  `
})
export class BookingDialog {
  form: FormGroup;
  slots: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private clinicService: ClinicService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    public dialogRef: MatDialogRef<BookingDialog>
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      slot: ['', Validators.required]
    });
    this.generateSlots();
  }

  generateSlots() {
    // Get the calculated date for this weekday
    const calculatedDate = this.data.getNextDateForWeekday(this.data.weekday);
    
    // Fetch available slots for this specific date
    this.clinicService.getAvailableSlotsPublic(calculatedDate).subscribe({
      next: (response) => {
        if (response.slots && response.slots.length > 0) {
          // Convert the slots to the format expected by the form
          this.slots = response.slots.map((slot: any) => 
            `${slot.start_time} - ${slot.end_time}`
          );
        } else {
          // Fallback to generating slots if no available slots found
          this.generateFallbackSlots();
        }
      },
      error: (error) => {
        console.error('Error fetching available slots:', error);
        // Fallback to generating slots if API call fails
        this.generateFallbackSlots();
      }
    });
  }

  generateFallbackSlots() {
    // توليد كل نصف ساعة بين start_time و end_time (fallback method)
    const start = this.parseTime(this.data.start_time);
    const end = this.parseTime(this.data.end_time);
    const slots: string[] = [];
    let current = new Date(start.getTime());
    while (current < end) {
      const next = new Date(current.getTime() + 30 * 60000);
      if (next > end) break;
      slots.push(`${this.formatTime(current)} - ${this.formatTime(next)}`);
      current = next;
    }
    this.slots = slots;
  }

  parseTime(str: string): Date {
    // str: "09:00" or "15:00"
    const [h, m] = str.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  }

  formatTime(date: Date): string {
    let h = date.getHours();
    const m = date.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
  }

  submit() {
    if (this.form.valid) {
      const { slot } = this.form.value;
      const [start_time, end_time] = slot.split(' - ');
      
      // Debug: Log the data object to see what's available
      console.log('Dialog data:', this.data);
      console.log('Weekday:', this.data.weekday);
      
      // Check authentication status
      const currentUser = this.authService.getCurrentUser();
      const isLoggedIn = this.authService.isLoggedIn();
      const isPatient = this.authService.isPatient();
      const token = this.authService.getToken();
      
      console.log('Auth status:', {
        isLoggedIn,
        isPatient,
        currentUser,
        hasToken: !!token
      });
      
      // Ensure user is logged in and is a patient
      if (!isLoggedIn) {
        this.snackBar.open('يجب تسجيل الدخول أولاً', 'إغلاق', { duration: 3000 });
        return;
      }
      
      if (!isPatient) {
        this.snackBar.open('يجب أن تكون مريضاً للحجز', 'إغلاق', { duration: 3000 });
        return;
      }
      
      // Ensure weekday exists and is valid
      if (!this.data.weekday) {
        this.snackBar.open('خطأ: لم يتم تحديد اليوم', 'إغلاق', { duration: 3000 });
        return;
      }
      
      const calculatedDate = this.data.getNextDateForWeekday(this.data.weekday);
      console.log('Calculated date:', calculatedDate);
      
      // Convert time format to match backend expectation (lowercase am/pm)
      const formatTimeForBackend = (timeStr: string) => {
        return timeStr.trim().toLowerCase();
      };
      
      const payload = {
        date: calculatedDate,
        start_time: formatTimeForBackend(start_time),
        end_time: formatTimeForBackend(end_time),
      };
      console.log('Booking payload:', payload);
      this.clinicService.createAppointment(payload).subscribe({
        next: () => {
          this.snackBar.open('تم إرسال طلب الحجز بنجاح!', 'إغلاق', { duration: 3000 });
          this.dialogRef.close();
          this.refreshSlots();
        },
        error: (err) => {
          console.error('Booking error:', err);
          console.error('Error details:', err.error);
          this.snackBar.open('حدث خطأ أثناء الحجز: ' + (err?.error?.detail || ''), 'إغلاق', { duration: 4000 });
        }
      });
    }
  }

  refreshSlots() {
    // Refresh the slots after a successful booking
    this.generateSlots();
  }
}
