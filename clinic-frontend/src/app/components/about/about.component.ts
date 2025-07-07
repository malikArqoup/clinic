import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  template: `
    <section class="about-section" id="about">
      <div class="about-container">
        <div class="section-header">
          <div class="header-icon">
            <mat-icon>medical_services</mat-icon>
          </div>
          <h2 class="section-title">من نحن</h2>
          <p class="section-subtitle">تعرف على عيادة الشفاء وفريقنا الطبي المتميز</p>
        </div>
        
      <div class="about-content">
        <div class="about-text">
            <div class="text-content">
              <h3 class="about-title">عن عيادة الشفاء</h3>
              <p class="about-description">
            عيادة الشفاء تقدم لكم أفضل الخدمات الطبية بأحدث الأجهزة وأمهر الأطباء في جميع التخصصات. نؤمن أن الصحة أمانة، ونسعى دائمًا لتقديم رعاية شاملة وإنسانية لكل مريض.
          </p>
              
              <div class="features-grid">
                <div class="feature-item" *ngFor="let feature of features; let i = index" 
                     [style.animation-delay]="(i * 0.1) + 's'">
                  <div class="feature-icon">
                    <mat-icon>{{ feature.icon }}</mat-icon>
                  </div>
                  <div class="feature-text">
                    <h4>{{ feature.title }}</h4>
                    <p>{{ feature.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="about-visual">
            <div class="image-container">
              <img src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=600&q=80" alt="فريق العيادة" />
              <div class="image-overlay"></div>
            </div>
            <div class="stats-container">
              <div class="stat-item" *ngFor="let stat of stats">
                <div class="stat-number">{{ stat.number }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
        </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .about-section {
      background: white;
      border-radius: 20px;
      padding: 48px 16px;
      margin: 48px 0;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    }
    
    .about-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 48px;
    }
    
    .header-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px auto;
      box-shadow: 0 8px 24px rgba(63, 81, 181, 0.3);
    }
    
    .header-icon mat-icon {
      font-size: 40px;
      color: white;
    }
    
    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .section-subtitle {
      font-size: 1.2rem;
      color: #64748b;
      max-width: 500px;
      margin: 0 auto;
      line-height: 1.6;
    }
    
    .about-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: center;
    }
    
    .about-text {
      text-align: right;
    }
    
    .about-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 20px;
      color: #1e293b;
    }
    
    .about-description {
      font-size: 1.1rem;
      line-height: 1.8;
      color: #475569;
      margin-bottom: 32px;
    }
    
    .features-grid {
      display: grid;
      gap: 20px;
    }
    
    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
      animation: slideInRight 0.6s ease-out forwards;
      opacity: 0;
      transform: translateX(30px);
    }
    
    @keyframes slideInRight {
      to {
        opacity: 1;
        transform: translateX(0);
    }
    }
    
    .feature-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    }
    
    .feature-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(63, 81, 181, 0.3);
    }
    
    .feature-icon mat-icon {
      font-size: 24px;
      color: white;
    }
    
    .feature-text h4 {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 8px;
      color: #1e293b;
    }
    
    .feature-text p {
      font-size: 0.95rem;
      color: #64748b;
      line-height: 1.5;
      margin: 0;
    }
    
    .about-visual {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .image-container {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    }
    
    .image-container img {
      width: 100%;
      height: 300px;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .image-container:hover img {
      transform: scale(1.05);
    }
    
    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(63, 81, 181, 0.2) 0%, rgba(92, 107, 192, 0.2) 100%);
    }
    
    .stats-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    
    .stat-item {
      text-align: center;
      padding: 20px 16px;
      background: linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%);
      border-radius: 12px;
      color: white;
      box-shadow: 0 4px 16px rgba(63, 81, 181, 0.3);
      transition: transform 0.3s ease;
    }
    
    .stat-item:hover {
      transform: translateY(-4px);
    }
    
    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .stat-label {
      font-size: 0.9rem;
      opacity: 0.9;
    }
    
    @media (max-width: 768px) {
      .about-section {
        padding: 32px 16px;
        margin: 32px 0;
      }
      
      .section-title {
        font-size: 2rem;
      }
      
      .about-content {
        grid-template-columns: 1fr;
        gap: 32px;
      }
      
      .about-title {
        font-size: 1.8rem;
      }
      
      .stats-container {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .feature-item {
        padding: 12px;
      }
      
      .feature-icon {
        width: 40px;
        height: 40px;
      }
      
      .feature-icon mat-icon {
        font-size: 20px;
      }
    }
  `
})
export class AboutComponent {
  features = [
    {
      icon: 'search',
      title: 'فحوصات شاملة وتشخيص دقيق',
      description: 'نستخدم أحدث التقنيات والأجهزة الطبية للتشخيص الدقيق'
    },
    {
      icon: 'people',
      title: 'أطباء مختصون في جميع المجالات',
      description: 'فريق طبي متميز من الأطباء المتخصصين في مختلف التخصصات'
    },
    {
      icon: 'emergency',
      title: 'خدمات طوارئ على مدار الساعة',
      description: 'خدمات طوارئ متاحة 24/7 لضمان رعاية فورية عند الحاجة'
    },
    {
      icon: 'schedule',
      title: 'حجز مواعيد إلكتروني سريع',
      description: 'نظام حجز متطور يمكنكم من حجز المواعيد بسهولة وسرعة'
    }
  ];
  
  stats = [
    { number: '15+', label: 'سنة خبرة' },
    { number: '50+', label: 'طبيب متخصص' },
    { number: '1000+', label: 'مريض راضٍ' }
  ];
}
