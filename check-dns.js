const dns = require('dns');

dns.lookup('db.kbughhqrcixjpqaqrjxu.supabase.co', (err, address, family) => {
  if (err) {
    console.log("النتيجة: قاعدة البيانات نائمة (Offline) أو متوقفة تماماً عن العمل.");
    console.log("الخطأ التقني:", err.message);
  } else {
    console.log("النتيجة: قاعدة البيانات تعمل (Online).");
    console.log("عنوان IP:", address);
  }
});
