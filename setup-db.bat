@echo off
echo 🗄️ إعداد قاعدة البيانات PostgreSQL...

REM Check if PostgreSQL is installed
psql --version >nul 2>&1
if errorlevel 1 (
    echo ❌ PostgreSQL غير مثبت. يرجى تثبيت PostgreSQL أولاً.
    pause
    exit /b 1
)

REM Database configuration
set DB_NAME=clinic_db
set DB_USER=postgres
set DB_PASSWORD=postgres123

echo 📝 إنشاء قاعدة البيانات...
createdb %DB_NAME% 2>nul || echo قاعدة البيانات موجودة بالفعل

echo 🔧 تشغيل script الإعداد...
psql -d %DB_NAME% -f setup-database.sql

echo ✅ تم إعداد قاعدة البيانات بنجاح!
echo 📊 قاعدة البيانات: %DB_NAME%
echo 👤 المستخدم: %DB_USER%
echo.
echo 🔗 رابط الاتصال: postgresql://%DB_USER%:%DB_PASSWORD%@localhost:5432/%DB_NAME%
pause 