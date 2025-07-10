@echo off
echo 🚀 بدء تشغيل نظام عيادة الشفاء...

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker غير مثبت. يرجى تثبيت Docker أولاً.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose غير مثبت. يرجى تثبيت Docker Compose أولاً.
    pause
    exit /b 1
)

echo 📦 بناء وتشغيل المشروع...
docker-compose up --build

echo ✅ تم تشغيل المشروع بنجاح!
echo 🌐 Frontend: http://localhost:4200
echo 🔧 Backend API: http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/docs
echo.
echo 👤 بيانات تسجيل دخول المدير:
echo    البريد الإلكتروني: admin@clinic.com
echo    كلمة المرور: admin123
pause 