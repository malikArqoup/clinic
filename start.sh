#!/bin/bash

echo "🚀 بدء تشغيل نظام عيادة الشفاء..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker غير مثبت. يرجى تثبيت Docker أولاً."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose غير مثبت. يرجى تثبيت Docker Compose أولاً."
    exit 1
fi

echo "📦 بناء وتشغيل المشروع..."
docker-compose up --build

echo "✅ تم تشغيل المشروع بنجاح!"
echo "🌐 Frontend: http://localhost:4200"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""
echo "👤 بيانات تسجيل دخول المدير:"
echo "   البريد الإلكتروني: admin@clinic.com"
echo "   كلمة المرور: admin123" 