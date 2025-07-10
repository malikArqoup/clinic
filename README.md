# عيادة الشفاء - نظام حجز المواعيد

نظام متكامل لإدارة عيادة طبية يتضمن حجز المواعيد وإدارة المرضى والمديرين.

## المميزات

- ✅ تسجيل دخول للمرضى والمديرين
- ✅ حجز المواعيد الطبية
- ✅ لوحة إدارة شاملة للمدير
- ✅ إدارة المرضى والحجوزات
- ✅ رفع وإدارة الصور
- ✅ واجهة مستخدم حديثة ومتجاوبة

## التقنيات المستخدمة

### Backend
- **FastAPI** - إطار عمل Python سريع
- **SQLAlchemy** - ORM لقاعدة البيانات
- **PostgreSQL** - قاعدة البيانات
- **JWT** - مصادقة المستخدمين
- **Cloudinary** - رفع الصور

### Frontend
- **Angular 19** - إطار عمل JavaScript
- **Angular Material** - مكونات UI
- **TypeScript** - لغة البرمجة
- **SCSS** - تنسيق CSS

## التثبيت والتشغيل

### الطريقة الأولى: Docker (موصى بها)

```bash
# تشغيل المشروع كاملاً
docker-compose up --build

# الوصول للتطبيق
# Frontend: http://localhost:4200
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### الطريقة الثانية: التثبيت المحلي

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# أو
venv\Scripts\activate     # Windows

pip install -r requirements.txt

# تأكد من تشغيل PostgreSQL أولاً
# ثم قم بتشغيل Backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd clinic-frontend
npm install
npm start
```

## بيانات تسجيل الدخول

### المدير
- **البريد الإلكتروني:** admin@clinic.com
- **كلمة المرور:** admin123

### المريض
- يمكن التسجيل من صفحة التسجيل

## متغيرات البيئة

انسخ ملف `env.example` إلى `.env` وعدل القيم:

```bash
cp backend/env.example backend/.env
```

### المتغيرات المطلوبة:
- `DATABASE_URL` - رابط قاعدة البيانات PostgreSQL
- `SECRET_KEY` - مفتاح التشفير
- `CLOUDINARY_*` - إعدادات Cloudinary للصور

### إعداد قاعدة البيانات:
```bash
# إنشاء قاعدة البيانات
createdb clinic_db

# تشغيل script الإعداد
psql -d clinic_db -f setup-database.sql
```

## هيكل المشروع

```
clinic/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── auth/           # المصادقة
│   │   ├── crud/           # عمليات قاعدة البيانات
│   │   ├── models/         # نماذج البيانات
│   │   ├── routes/         # مسارات API
│   │   └── schemas/        # مخططات البيانات
│   ├── static/             # الملفات الثابتة
│   └── requirements.txt    # مكتبات Python
├── clinic-frontend/        # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # مكونات Angular
│   │   │   └── services/   # خدمات API
│   │   └── styles.scss     # التنسيقات
│   └── package.json        # مكتبات Node.js
├── Dockerfile              # تكوين Docker للإنتاج
├── docker-compose.yml      # تكوين Docker Compose
└── README.md              # هذا الملف
```

## API Endpoints

### المصادقة
- `POST /register` - تسجيل مريض جديد
- `POST /login` - تسجيل دخول المريض
- `POST /admin-login` - تسجيل دخول المدير

### الحجوزات
- `GET /bookings` - عرض الحجوزات
- `POST /bookings` - إنشاء حجز جديد
- `PUT /bookings/{id}` - تحديث الحجز
- `DELETE /bookings/{id}` - حذف الحجز

### لوحة الإدارة
- `GET /admin/dashboard/stats` - إحصائيات لوحة التحكم
- `GET /admin/bookings` - جميع الحجوزات
- `GET /admin/users` - جميع المستخدمين

## النشر (Deployment)

### Heroku
```bash
# إعداد Heroku
heroku create your-app-name
heroku config:set SECRET_KEY=your-secret-key
git push heroku main
```

### Railway
```bash
# رفع المشروع لـ Railway
railway login
railway init
railway up
```

### Vercel (Frontend)
```bash
# نشر Frontend على Vercel
npm install -g vercel
vercel --prod
```

## المساهمة

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للـ branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT.

## الدعم

للدعم والمساعدة، يرجى فتح issue في GitHub. 