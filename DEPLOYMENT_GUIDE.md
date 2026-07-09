# 🚀 الدليل الشامل لرفع نظام قيادة على الاستضافة (Production)

هذا الدليل مصمم ليكون بأرقى وأسهل أسلوب لرفع النظام الخاص بك على أي استضافة (VPS) مثل Hostinger أو DigitalOcean.

## 1. المتطلبات الأساسية على الخادم (Server)
يجب تثبيت البرامج التالية على خادم الاستضافة (Ubuntu):
- Node.js (الإصدار 20 أو أحدث)
- PostgreSQL (قاعدة البيانات)
- PM2 (لتشغيل الباك إند في الخلفية)
- Nginx (لربط الدومين وعرض النظام)

## 2. تجهيز قاعدة البيانات
قم بإنشاء قاعدة بيانات في PostgreSQL على الخادم وقم بتعديل ملف `.env` في مجلد الباك إند `backend` ليتوافق مع بيانات الخادم:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=qiyada_db
JWT_SECRET=super_secret_key_for_production
```

## 3. تشغيل واجهة النظام (الباك إند - Backend)
من موجه الأوامر على الخادم، ادخل إلى مجلد الباك إند ونفذ الأوامر التالية:
```bash
cd backend
npm install
npm run build
pm2 start dist/main.js --name "qiyada-api"
pm2 save
```
*(ملاحظة: لقد قمت بتفعيل خاصية الـ CORS مسبقاً في النظام ليسمح بالاتصال من أي دومين بأمان!)*

## 4. بناء واجهة المستخدم (الفرونت إند - Frontend)
ادخل إلى مجلد الفرونت إند ونفذ أوامر البناء:
```bash
cd frontend
npm install
npm run build
```
سيقوم هذا الأمر بإنشاء مجلد باسم `dist`. هذا المجلد يحتوي على النظام كاملاً وجاهزاً للعمل!
قم بنسخ محتويات مجلد `dist` إلى المسار الخاص بالويب على الخادم، مثلاً: `/var/www/qiyada`

## 5. ضبط Nginx (لربط الدومين)
قم بإنشاء ملف إعدادات في Nginx لربط الدومين الخاص بك (مثلاً: `sys.qiyada.com`) كالتالي:

```nginx
server {
    listen 80;
    server_name sys.qiyada.com;

    # 1. عرض واجهة النظام (الفرونت إند)
    location / {
        root /var/www/qiyada;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # 2. توجيه الطلبات البرمجية للباك إند
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

بعد ذلك قم بإعادة تشغيل Nginx:
```bash
sudo systemctl restart nginx
```

🎉 **مبروك! النظام الآن مرفوع ويعمل بأرقى مستوى وبأعلى كفاءة على الإنترنت!**
