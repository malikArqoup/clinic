#!/bin/bash

echo "🗄️ إعداد قاعدة البيانات PostgreSQL..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL غير مثبت. يرجى تثبيت PostgreSQL أولاً."
    exit 1
fi

# Database configuration
DB_NAME="clinic_db"
DB_USER="postgres"
DB_PASSWORD="postgres123"

echo "📝 إنشاء قاعدة البيانات..."
createdb $DB_NAME 2>/dev/null || echo "قاعدة البيانات موجودة بالفعل"

echo "🔧 تشغيل script الإعداد..."
psql -d $DB_NAME -f setup-database.sql

echo "✅ تم إعداد قاعدة البيانات بنجاح!"
echo "📊 قاعدة البيانات: $DB_NAME"
echo "👤 المستخدم: $DB_USER"
echo ""
echo "🔗 رابط الاتصال: postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME" 