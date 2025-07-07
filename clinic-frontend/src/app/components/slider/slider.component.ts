import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ClinicService, SliderImage } from '../../services/clinic.service';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatIconModule],
  template: `
    <div class="slider-container">
      <div class="slide" *ngFor="let slide of slides; let i = index" [class.active]="i === currentSlide">
        <div class="slide-background" [style.background-image]="'url(' + getImageUrl(slide.image_url || '') + ')'" ></div>
        <div class="slide-overlay"></div>
        <div class="slide-content">
          <h2 class="slide-title">{{ slide.title }}</h2>
          <p class="slide-text">{{ slide.text }}</p>
          <button class="cta-button" mat-raised-button color="primary" (click)="scrollToBooking()">
            <mat-icon>schedule</mat-icon>
            احجز موعدك الآن
          </button>
        </div>
      </div>
      <div class="slider-controls">
        <button class="nav-button prev" (click)="previousSlide()">
          <mat-icon>chevron_left</mat-icon>
        </button>
        <button class="nav-button next" (click)="nextSlide()">
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>
      <div class="slider-dots">
        <span *ngFor="let slide of slides; let i = index" 
              (click)="goToSlide(i)" 
              [class.active-dot]="i === currentSlide">
        </span>
      </div>
    </div>
  `,
  styles: `
    .slider-container {
      position: relative;
      width: 100%;
      height: 500px;
      overflow: hidden;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      margin-bottom: 32px;
    }
    
    .slide {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: opacity 0.8s ease-in-out;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .slide.active {
      opacity: 1;
      z-index: 2;
    }
    
    .slide-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
    
    .slide-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(63, 81, 181, 0.25) 0%, rgba(156, 39, 176, 0.10) 100%);
      z-index: 1;
    }
    
    .slide-content {
      position: relative;
      z-index: 3;
      text-align: center;
      color: white;
      max-width: 600px;
      padding: 0 32px;
      animation: slideInUp 0.8s ease-out;
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .slide-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 16px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      line-height: 1.2;
    }
    
    .slide-text {
      font-size: 1.3rem;
      margin-bottom: 32px;
      line-height: 1.6;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
      opacity: 0.95;
    }
    
    .cta-button {
      font-size: 1.25rem;
      font-weight: 700;
      padding: 16px 40px;
      border-radius: 32px;
      background: linear-gradient(90deg, #3f51b5 0%, #2196f3 100%);
      color: #fff !important;
      box-shadow: 0 6px 24px rgba(33, 150, 243, 0.18);
      border: none;
      outline: none;
      transition: all 0.25s cubic-bezier(.4,2,.3,1);
      display: inline-flex;
      align-items: center;
      gap: 12px;
      letter-spacing: 1px;
      margin-top: 16px;
    }
    .cta-button mat-icon {
      font-size: 1.5rem;
      margin-left: 8px;
      color: #fff;
    }
    .cta-button:hover, .cta-button:focus {
      transform: scale(1.06) translateY(-2px);
      box-shadow: 0 10px 32px rgba(33, 150, 243, 0.25);
      background: linear-gradient(90deg, #2196f3 0%, #3f51b5 100%);
      color: #fff;
    }
    
    .slider-controls {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      z-index: 4;
      display: flex;
      justify-content: space-between;
      padding: 0 24px;
    }
    
    .nav-button {
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .nav-button:hover {
      background: white;
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    .nav-button mat-icon {
      color: #3f51b5;
      font-size: 24px;
    }
    
    .slider-dots {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 12px;
      z-index: 4;
    }
    
    .slider-dots span {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      display: inline-block;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }
    
    .slider-dots span:hover {
      background: rgba(255, 255, 255, 0.8);
      transform: scale(1.2);
    }
    
    .slider-dots .active-dot {
      background: white;
      border-color: #3f51b5;
      transform: scale(1.2);
    }
    
    @media (max-width: 768px) {
      .slider-container {
        height: 400px;
      }
      
      .slide-title {
        font-size: 2rem;
      }
      
      .slide-text {
        font-size: 1.1rem;
      }
      
      .slider-controls {
        padding: 0 16px;
      }
      
      .nav-button {
        width: 40px;
        height: 40px;
      }
    }
  `
})
export class SliderComponent implements OnInit {
  slides: SliderImage[] = [];
  currentSlide = 0;
  intervalId: any;
  apiUrl: string = 'http://localhost:8000';

  constructor(private clinicService: ClinicService) {}

  ngOnInit() {
    this.clinicService.getSliderImagesPublic().subscribe(images => {
      this.slides = images.filter(img => !!img.image_url).sort((a, b) => a.order - b.order);
      this.startAutoSlide();
    });
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.resetInterval();
  }

  previousSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
    this.resetInterval();
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.resetInterval();
  }

  resetInterval() {
    clearInterval(this.intervalId);
    this.startAutoSlide();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  scrollToBooking() {
    const el = document.getElementById('booking');
    if (el) {
      const navbarHeight = 80;
      const y = el.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return this.apiUrl + imageUrl;
  }
}
