@echo off
echo ================================
echo   نظام إدارة القواطر - بدء التشغيل
echo ================================

echo.
echo [1/2] تشغيل الواجهة الخلفية (Backend) على المنفذ 3000...
start "Backend - NestJS" cmd /k "cd backend && npm run start:dev"

echo [2/2] تشغيل الواجهة الأمامية (Frontend) على المنفذ 5173...
timeout /t 5 /nobreak > NUL
start "Frontend - React" cmd /k "cd frontend && npm run dev"

echo.
echo ================================
echo   التطبيق يعمل على:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3000
echo ================================
echo.
echo البيانات الافتراضية للدخول:
echo   البريد:      admin@prokasey.com
echo   كلمة المرور: Admin@123
echo.
pause
