# منارة الصف الذكي

نموذج أولي عربي أولًا مبني بـ Next.js App Router لإدارة طاقة القاعات الدراسية الذكية في الجامعات السعودية. يتضمن بوابتين رئيسيتين:

- `/admin` للإدارة التشغيلية ومراقبة القاعات والطلبات والسجلات
- `/faculty` لعضو هيئة التدريس لعرض الجلسة الحالية ورفع الطلبات

## التشغيل

```bash
npm install
npm run dev
```

ثم افتح:

- `http://localhost:3000/`

## المسارات

- `/` صفحة هبوط عربية مع اختيار المسار
- `/admin` الرئيسية (رسومات ومؤشرات)
- `/admin/rooms` القاعات
- `/admin/requests` الطلبات
- `/admin/faculty` أعضاء الهيئة
- `/admin/logs` السجل
- `/faculty` دخول افتراضي لعضو هيئة التدريس
- `/faculty/home?facultyId=f001` التطبيق الداخلي لعضو هيئة التدريس
- `/api/admin/overview` بيانات لوحة الإدارة
- `/api/faculty/session?facultyId=f001` بيانات جلسة عضو هيئة التدريس
- `/api/requests` إنشاء طلب جديد
- `/api/requests/:id/review` مراجعة طلب من الإدارة

## ملاحظات تقنية

- المشروع يستخدم `Next.js 15` و`App Router`
- الواجهة عربية مع `RTL` وطابع Dashboard داكن
- التخزين محلي عبر ملف JSON في [data/db.json](/home/openclaw-khaled/.openclaw/workspace/smart-classroom-prototype/data/db.json)
- توجد طبقة مساعدة آمنة للقراءة والكتابة في [lib/db.js](/home/openclaw-khaled/.openclaw/workspace/smart-classroom-prototype/lib/db.js)
- منطق الجلسات والطلبات وتلخيص البيانات موجود في [lib/domain.js](/home/openclaw-khaled/.openclaw/workspace/smart-classroom-prototype/lib/domain.js)

## رحلة العرض التجريبي

- الكهرباء تُفتح تلقائيًا لأول 10 دقائق من بداية المحاضرة
- بعد انتهاء النافذة، يتطلب الفتح المتأخر سببًا ويذهب للمراجعة
- طلب تغيير القاعة وطلب التمديد يُعتمدان فورًا لأغراض العرض
- قبل نهاية المحاضرة بـ 5 دقائق يظهر تنبيه للتمديد
- كل إجراء يُسجل في السجل الإداري تحت اسم عضو هيئة التدريس مع بصمة تدقيق مرئية
