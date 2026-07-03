# نظام إدارة القواطر 🚛

نظام متكامل لإدارة قواطر النقل الثقيل يشمل إدارة الإيرادات والمصروفات والتقارير المالية.

## المميزات الرئيسية

| الميزة | الوصف |
|--------|-------|
| المصادقة | تسجيل دخول آمن مع JWT |
| إدارة القواطر | تتبع حالة كل قاطرة وسائقها |
|  إدارة السواقين | بيانات وتواصل وتتبع الرخص |
|  إدارة المقاولين | الأرصدة والفواتير والتواصل |
|  الإيرادات | تسجيل الفواتير وتتبع حالة الدفع |
|  المصروفات | تسجيل المصاريف بنظام اعتماد مدير |
|  لوحة التحكم | KPIs + رسوم بيانية تفاعلية |
| 📈 التقارير | تقارير مالية قابلة للفلترة والطباعة |
| 🔍 البحث المتقدم | بحث شامل في القواطر والفواتير والمصاريف |
| 📓 سجل التدقيق | تتبع كل عملية في النظام |

## هيكل المشروع

```
prokasey/
├── backend/          # NestJS API
│   └── src/
│       ├── entities/ # نماذج قاعدة البيانات
│       ├── auth/     # المصادقة JWT
│       ├── trucks/   # وحدة القواطر
│       ├── drivers/  # وحدة السواقين
│       ├── contractors/ # وحدة المقاولين
│       ├── invoices/ # وحدة الفواتير
│       ├── expenses/ # وحدة المصروفات
│       ├── expense-categories/ # فئات المصروفات
│       ├── dashboard/  # إحصائيات لوحة التحكم
│       ├── audit/    # سجل التدقيق
│       └── search/   # البحث المتقدم
│
└── frontend/         # React + Vite + TailwindCSS
    └── src/
        ├── components/ # مكونات مشتركة (Layout, GlobalSearch)
        └── pages/     # صفحات النظام
```

## تشغيل النظام محلياً

### متطلبات
- Node.js 20+
- npm

### الواجهة الخلفية (Backend)
```bash
cd backend
npm install
npm run start:dev
```
يعمل على: http://localhost:3000

### الواجهة الأمامية (Frontend)
```bash
cd frontend
npm install
npm run dev
```
يعمل على: http://localhost:5173

## النشر بـ Docker

```bash
# تشغيل النظام الكامل
docker-compose up -d

# إيقاف النظام
docker-compose down
```

بعد التشغيل:
- **الواجهة الأمامية**: http://localhost
- **الـ API**: http://localhost:3000

## بيانات الدخول الافتراضية (تطوير)
```
البريد: admin@prokasey.com
كلمة المرور: Admin@123
```

## التقنيات المستخدمة

| الطبقة | التقنية |
|--------|---------|
| Backend | NestJS + TypeORM |
| Database | SQLite (تطوير) / PostgreSQL (إنتاج) |
| Frontend | React 18 + TypeScript + Vite |
| UI | TailwindCSS v3 |
| Charts | Recharts |
| Auth | JWT + Passport |
| Deploy | Docker + Nginx |

---
© 2024 نظام إدارة القواطر. جميع الحقوق محفوظة.
