import { Component, HostListener } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, CommonModule],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled" [class.mobile-menu-open]="isMobileMenuOpen">
      <div class="nav-container">
        <!-- Logo Section -->
        <div class="logo-section" (click)="scrollToTop()">
          <div class="logo-container">
            <div class="logo-icon">
              <mat-icon>medical_services</mat-icon>
            </div>
            <div class="logo-text">
        <span class="clinic-name">عيادة الشفاء</span>
              <span class="clinic-subtitle">Al-Shifa Clinic</span>
            </div>
          </div>
        </div>

        <!-- Desktop Navigation -->
        <div class="nav-links" [class.hidden]="isMobileMenuOpen">
          <a class="nav-link" 
             *ngFor="let link of navLinks; let i = index"
             [href]="link.href"
             [class.active]="link.isActive"
             (click)="scrollToSection(link.href, $event)"
             [style.animation-delay]="(i * 0.1) + 's'">
            <mat-icon class="link-icon">{{ link.icon }}</mat-icon>
            <span class="link-text">{{ link.text }}</span>
            <div class="link-underline"></div>
          </a>
        </div>

        <!-- CTA Buttons -->
        <div class="cta-section" [class.hidden]="isMobileMenuOpen">
          <button class="cta-button" (click)="scrollToContact()">
            <mat-icon>schedule</mat-icon>
            <span>احجز موعدك</span>
          </button>
          <button class="login-btn" (click)="goToLogin()">
            <mat-icon>login</mat-icon>
            <span>تسجيل / تسجيل الدخول</span>
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <button class="mobile-menu-btn" (click)="toggleMobileMenu()" [class.active]="isMobileMenuOpen">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>

      <!-- Mobile Menu Overlay -->
      <div class="mobile-menu-overlay" [class.active]="isMobileMenuOpen" (click)="closeMobileMenu()">
        <div class="mobile-menu-content" (click)="$event.stopPropagation()">
          <div class="mobile-menu-header">
            <div class="mobile-logo">
              <mat-icon>medical_services</mat-icon>
              <span>عيادة الشفاء</span>
            </div>
            <button class="close-btn" (click)="closeMobileMenu()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          
          <div class="mobile-nav-links">
            <a class="mobile-nav-link" 
               *ngFor="let link of navLinks"
               [href]="link.href"
               (click)="scrollToSection(link.href, $event); closeMobileMenu()">
              <mat-icon>{{ link.icon }}</mat-icon>
              <span>{{ link.text }}</span>
            </a>
          </div>
          
          <div class="mobile-cta">
            <button class="mobile-cta-button" (click)="scrollToContact(); closeMobileMenu()">
              <mat-icon>schedule</mat-icon>
              احجز موعدك الآن
            </button>
            <button class="mobile-login-btn" (click)="goToLogin(); closeMobileMenu()">
              <mat-icon>login</mat-icon>
              تسجيل / تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
      </nav>
  `,
  styles: `
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }

    .navbar.scrolled {
      background: rgba(255, 255, 255, 0.98);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
      border-bottom: 1px solid rgba(63, 81, 181, 0.1);
    }

    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 80px;
    }

    /* Logo Section */
    .logo-section {
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .logo-section:hover {
      transform: scale(1.05);
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(63, 81, 181, 0.3);
      transition: all 0.3s ease;
    }

    .logo-icon:hover {
      transform: rotate(5deg) scale(1.1);
      box-shadow: 0 6px 20px rgba(63, 81, 181, 0.4);
    }

    .logo-icon mat-icon {
      font-size: 28px;
      color: white;
    }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .clinic-name {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.2;
    }

    .clinic-subtitle {
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 500;
      letter-spacing: 1px;
    }

    /* Navigation Links */
    .nav-links {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-link {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      color: #475569;
      text-decoration: none;
      font-weight: 500;
      font-size: 1rem;
      border-radius: 12px;
      transition: all 0.3s ease;
      animation: slideInDown 0.6s ease-out forwards;
      opacity: 0;
      transform: translateY(-20px);
    }

    @keyframes slideInDown {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .nav-link:hover {
      color: #3f51b5;
      background: rgba(63, 81, 181, 0.1);
      transform: translateY(-2px);
    }

    .nav-link.active {
      color: #3f51b5;
      background: rgba(63, 81, 181, 0.1);
    }

    .link-icon {
      font-size: 20px;
      transition: transform 0.3s ease;
    }

    .nav-link:hover .link-icon {
      transform: scale(1.2);
    }

    .link-underline {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #3f51b5, #5c6bc0);
      transition: all 0.3s ease;
      transform: translateX(-50%);
    }

    .nav-link:hover .link-underline,
    .nav-link.active .link-underline {
      width: 80%;
    }

    /* CTA Button */
    .cta-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%);
      color: white;
      border: none;
      border-radius: 50px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 16px rgba(63, 81, 181, 0.3);
      animation: slideInDown 0.6s ease-out 0.4s forwards;
      opacity: 0;
      transform: translateY(-20px);
    }

    .cta-button:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(63, 81, 181, 0.4);
      background: linear-gradient(135deg, #5c6bc0 0%, #3f51b5 100%);
    }

    .cta-button mat-icon {
      font-size: 20px;
    }

    /* Mobile Menu Button */
    .mobile-menu-btn {
      display: none;
      flex-direction: column;
      gap: 4px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .mobile-menu-btn:hover {
      background: rgba(63, 81, 181, 0.1);
    }

    .hamburger-line {
      width: 24px;
      height: 2px;
      background: #475569;
      transition: all 0.3s ease;
      border-radius: 1px;
    }

    .mobile-menu-btn.active .hamburger-line:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }

    .mobile-menu-btn.active .hamburger-line:nth-child(2) {
      opacity: 0;
    }

    .mobile-menu-btn.active .hamburger-line:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }

    /* Mobile Menu Overlay */
    .mobile-menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(40, 53, 147, 0.25); /* أزرق شفاف واضح */
      z-index: 2000;
      display: none;
      align-items: flex-start;
      justify-content: flex-end;
      transition: background 0.3s;
    }
    .mobile-menu-overlay.active {
      display: flex;
    }
    .mobile-menu-content {
      background: #fff;
      width: 85vw;
      max-width: 340px;
      min-height: 100vh;
      box-shadow: 0 8px 32px rgba(40, 53, 147, 0.18);
      border-radius: 0 0 0 32px;
      padding: 32px 20px 24px 20px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      position: relative;
      animation: slideInMenu 0.3s cubic-bezier(.4,2,.3,1);
    }
    @keyframes slideInMenu {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .mobile-menu-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .mobile-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.2rem;
      font-weight: 700;
      color: #3f51b5;
    }
    .mobile-logo mat-icon {
      color: #3f51b5;
      font-size: 1.6rem;
    }
    .close-btn {
      background: none;
      border: none;
      color: #3f51b5;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      transition: background 0.2s;
    }
    .close-btn:hover {
      background: #f1f5f9;
    }
    .mobile-nav-links {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .mobile-nav-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 0;
      color: #283593;
      font-size: 1.1rem;
      font-weight: 600;
      text-decoration: none;
      border-radius: 8px;
      transition: background 0.2s, color 0.2s;
    }
    .mobile-nav-link:hover {
      background: #f5f7fa;
      color: #1a237e;
    }
    .mobile-nav-link mat-icon {
      color: #3f51b5;
      font-size: 1.3rem;
    }
    .mobile-cta {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 24px;
    }
    .mobile-cta-button, .mobile-login-btn {
      font-size: 1.1rem;
      font-weight: 700;
      padding: 14px 0;
      border-radius: 24px;
      background: linear-gradient(90deg, #3f51b5 0%, #2196f3 100%);
      color: #fff;
      border: none;
      outline: none;
      box-shadow: 0 4px 16px rgba(33, 150, 243, 0.13);
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: center;
      transition: background 0.2s, transform 0.2s;
    }
    .mobile-cta-button:hover, .mobile-login-btn:hover {
      background: linear-gradient(90deg, #2196f3 0%, #3f51b5 100%);
      transform: scale(1.04);
    }
    .mobile-cta-button mat-icon, .mobile-login-btn mat-icon {
      color: #fff;
      font-size: 1.3rem;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .nav-container {
        padding: 0 16px;
        height: 70px;
      }

      .nav-links,
      .cta-section {
        display: none;
      }

      .mobile-menu-btn {
        display: flex;
      }

      .clinic-name {
        font-size: 1.3rem;
    }

      .clinic-subtitle {
        font-size: 0.7rem;
      }

      .logo-icon {
        width: 40px;
        height: 40px;
      }

      .logo-icon mat-icon {
        font-size: 24px;
      }
    }

    @media (max-width: 480px) {
      .nav-container {
        padding: 0 12px;
      }

      .clinic-name {
        font-size: 1.1rem;
      }

      .clinic-subtitle {
        display: none;
      }
    }

    @media (max-width: 600px) {
      .logo-section {
        flex-direction: row;
        align-items: center;
        gap: 6px;
      }
      .logo-text {
        flex-direction: column;
        align-items: flex-start;
        max-width: 80px;
        overflow: hidden;
      }
      .clinic-name {
        font-size: 1.1rem;
        line-height: 1.1;
      }
      .clinic-subtitle {
        font-size: 0.65rem;
        line-height: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #64748b;
        display: none;
      }
    }

    /* Utility Classes */
    .hidden {
      display: none !important;
    }

    .cta-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .login-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: linear-gradient(135deg, #fff 0%, #e2e8f0 100%);
      color: #3f51b5;
      border: 2px solid #3f51b5;
      border-radius: 50px;
      font-weight: 600;
      font-size: 1rem;
      text-decoration: none;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(63, 81, 181, 0.08);
    }
    .login-btn:hover {
      background: #3f51b5;
      color: #fff;
      border-color: #3f51b5;
      transform: translateY(-2px) scale(1.05);
    }
    .login-btn mat-icon {
      font-size: 20px;
    }
    .mobile-login-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      padding: 14px 0;
      background: linear-gradient(135deg, #fff 0%, #e2e8f0 100%);
      color: #3f51b5;
      border: 2px solid #3f51b5;
      border-radius: 50px;
      font-weight: 600;
      font-size: 1rem;
      text-decoration: none;
      justify-content: center;
      transition: all 0.3s ease;
    }
    .mobile-login-btn:hover {
      background: #3f51b5;
      color: #fff;
      border-color: #3f51b5;
      transform: translateY(-2px) scale(1.05);
    }
    .mobile-login-btn mat-icon {
      font-size: 20px;
    }
  `
})
export class NavBarComponent {
  isScrolled = false;
  isMobileMenuOpen = false;

  navLinks = [
    { text: 'الرئيسية', href: '#home', icon: 'home', isActive: true },
    { text: 'عن العيادة', href: '#about', icon: 'medical_services', isActive: false },
    { text: 'أوقات الحجز', href: '#booking', icon: 'schedule', isActive: false },
    { text: 'تواصل معنا', href: '#contact', icon: 'contact_mail', isActive: false }
  ];

  contactInfo = [
    { icon: 'phone', value: '0599123456' },
    { icon: 'email', value: 'info@ramclinic.com' },
    { icon: 'location_on', value: 'فلسطين - رام الله' }
  ];

  constructor(private router: Router) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToSection(href: string, event: Event) {
    event.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  }

  scrollToContact() {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      const navbarHeight = 80;
      const elementPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
