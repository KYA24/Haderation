import Link from "next/link";
import {
  ArrowRightLeft,
  CalendarDays,
  Clock3,
  DoorOpen,
  MapPin,
  TimerReset,
} from "lucide-react";
import { getFacultyPortalData } from "@/lib/domain";

export const dynamic = "force-dynamic";

const weekDays = [
  { id: 0, label: "الأحد" },
  { id: 1, label: "الإثنين" },
  { id: 2, label: "الثلاثاء" },
  { id: 3, label: "الأربعاء" },
  { id: 4, label: "الخميس" },
  { id: 5, label: "الجمعة" },
  { id: 6, label: "السبت" },
];

function buildDate(date, timeText) {
  const [hours, minutes] = timeText.split(":").map(Number);
  const nextDate = new Date(date);
  nextDate.setHours(hours, minutes, 0, 0);
  return nextDate;
}

function getDateForWeekday(baseDate, targetDay) {
  const date = new Date(baseDate);
  const diff = targetDay - date.getDay();
  date.setDate(date.getDate() + diff);
  return date;
}

function formatTime(dateValue) {
  return new Intl.DateTimeFormat("ar-SA", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateValue));
}

export default async function AdminFacultyDetailPage({ params, searchParams }) {
  const facultyId = params?.id || "f001";
  const data = await getFacultyPortalData(facultyId);
  const schedule = data.faculty.schedule;
  const now = new Date();
  const selectedDay = Number((await searchParams)?.day ?? now.getDay());
  const safeSelectedDay = Number.isNaN(selectedDay) ? now.getDay() : selectedDay;
  const selectedDate = getDateForWeekday(now, safeSelectedDay);
  const hasClass = safeSelectedDay === schedule.weekday;
  const isToday = safeSelectedDay === now.getDay();
  const startAt = buildDate(selectedDate, schedule.startTime);
  const endAt = buildDate(selectedDate, schedule.endTime);
  const totalMinutes = Math.max(1, Math.round((endAt.getTime() - startAt.getTime()) / 60000));
  const remainingMinutes = isToday
    ? Math.max(0, Math.ceil((endAt.getTime() - now.getTime()) / 60000))
    : totalMinutes;
  const elapsedMinutes = Math.max(0, totalMinutes - remainingMinutes);
  const progress = isToday ? Math.min(100, Math.max(0, (elapsedMinutes / totalMinutes) * 100)) : 0;
  const arrivalWindowEnd = new Date(startAt.getTime() + 10 * 60 * 1000);
  const extensionWindowStart = new Date(endAt.getTime() - 10 * 60 * 1000);
  const showActions = hasClass && isToday;
  const showStartLecture = showActions && now >= startAt && now <= arrivalWindowEnd;
  const showLateActions = showActions && now > arrivalWindowEnd && now < extensionWindowStart;
  const showExtension = showActions && now >= extensionWindowStart;

  return (
    <section className="space-y-5">
      <div className="card p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black text-[var(--kfu-green-700)]">ملف عضو هيئة التدريس</p>
            <h2 className="mt-2 text-3xl font-black text-[var(--ink-900)]">{data.faculty.name}</h2>
            <p className="mt-2 text-sm text-[var(--ink-700)]">{data.faculty.department}</p>
          </div>
          <div className="rounded-[18px] border border-[var(--line)] bg-[var(--surface-soft)] px-4 py-3 text-sm font-black text-[var(--ink-700)]">
            آخر حالة: {data.latestRequestLabel}
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="glass-card p-4">
            <p className="text-xs font-bold text-[var(--ink-700)]">القاعة الأساسية</p>
            <div className="mt-2 flex items-center gap-2 text-sm font-black text-[var(--ink-900)]">
              <MapPin className="h-4 w-4 text-[var(--kfu-green-800)]" />
              {data.session.room.name}
            </div>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-bold text-[var(--ink-700)]">توقيت المحاضرة</p>
            <p className="mt-2 text-sm font-black text-[var(--ink-900)]">
              {schedule.startTime} - {schedule.endTime}
            </p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-bold text-[var(--ink-700)]">المقرر</p>
            <p className="mt-2 text-sm font-black text-[var(--ink-900)]">{schedule.courseName}</p>
          </div>
        </div>
      </div>

      <div className="card p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-[var(--kfu-green-700)]">الجدول الدراسي</p>
            <h3 className="mt-2 text-2xl font-black text-[var(--ink-900)]">عرض حسب اليوم</h3>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--ink-700)]">
            <CalendarDays className="h-4 w-4 text-[var(--kfu-green-800)]" />
            اليوم: {weekDays.find((day) => day.id === now.getDay())?.label}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {weekDays.map((day) => {
            const active = day.id === safeSelectedDay;
            return (
              <Link
                key={day.id}
                href={`/admin/faculty/${data.faculty.id}?day=${day.id}`}
                className={`rounded-full border px-4 py-2 text-xs font-black transition ${
                  active
                    ? "border-[var(--kfu-green-700)] bg-[var(--kfu-green-800)] text-white"
                    : "border-[var(--line)] bg-white text-[var(--ink-700)] hover:bg-[var(--kfu-green-100)]"
                }`}
              >
                {day.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-5 rounded-[18px] border border-[var(--line)] bg-[var(--surface-soft)] p-4">
          {hasClass ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-[var(--ink-900)]">{schedule.courseName}</p>
                <p className="mt-1 text-xs text-[var(--ink-700)]">
                  {schedule.courseCode} • الشعبة {schedule.section}
                </p>
              </div>
              <div className="rounded-full bg-white px-4 py-2 text-xs font-black text-[var(--kfu-green-800)]">
                {formatTime(startAt)} - {formatTime(endAt)}
              </div>
            </div>
          ) : (
            <p className="text-sm font-bold text-[var(--ink-700)]">لا توجد محاضرة لهذا اليوم.</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
        <section className="card p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-[var(--kfu-green-700)]">رحلة المحاضرة</p>
              <h3 className="mt-2 text-2xl font-black text-[var(--ink-900)]">الخطوات التشغيلية</h3>
            </div>
            <div className="rounded-full bg-[var(--kfu-green-100)] px-4 py-2 text-xs font-black text-[var(--kfu-green-800)]">
              ربط BMS مفعل
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm font-bold text-[var(--ink-700)]">
            <p>1) وصول الدكتور للقاعة وتشغيل الأنظمة.</p>
            <p>2) نافذة تشغيل تلقائي أول 10 دقائق.</p>
            <p>3) بعد التأخير: فتح متأخر أو تغيير قاعة.</p>
            <p>4) نهاية المحاضرة: طلب تمديد الجلسة.</p>
          </div>

          <div className="mt-5 grid gap-3">
            {showStartLecture ? (
              <button type="button" className="button-primary w-full">
                <DoorOpen className="h-4 w-4" />
                بدء المحاضرة وتشغيل المرافق
              </button>
            ) : null}

            {showLateActions ? (
              <div className="grid gap-2 md:grid-cols-2">
                <button type="button" className="button-primary w-full">
                  <DoorOpen className="h-4 w-4" />
                  فتح متأخر
                </button>
                <button type="button" className="button-secondary w-full">
                  <ArrowRightLeft className="h-4 w-4" />
                  تغيير القاعة
                </button>
              </div>
            ) : null}

            {showExtension ? (
              <button type="button" className="button-secondary w-full">
                <TimerReset className="h-4 w-4" />
                تمديد الجلسة (نهاية المحاضرة)
              </button>
            ) : null}

            {!showActions ? (
              <div className="rounded-[16px] bg-[var(--surface-soft)] px-4 py-3 text-xs font-bold text-[var(--ink-700)]">
                {hasClass
                  ? "المحاضرة ليست ضمن وقت اليوم الحالي."
                  : "لا توجد محاضرة اليوم لهذا العضو."}
              </div>
            ) : null}
          </div>
        </section>

        <section className="card p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-[var(--kfu-green-700)]">عداد المحاضرة</p>
              <h3 className="mt-2 text-2xl font-black text-[var(--ink-900)]">متابعة الوقت</h3>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--ink-700)]">
              <Clock3 className="h-4 w-4 text-[var(--kfu-green-800)]" />
              {remainingMinutes} دقيقة
            </div>
          </div>

          <div className="mt-5">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-[var(--ink-700)]">
              <span>البداية {formatTime(startAt)}</span>
              <span>النهاية {formatTime(endAt)}</span>
            </div>
          </div>

          <div className="mt-5 rounded-[16px] border border-[var(--line)] bg-[var(--surface-soft)] px-4 py-3 text-xs font-bold text-[var(--ink-700)]">
            {showStartLecture
              ? "الوقت مناسب لبدء المحاضرة وتشغيل الأنظمة."
              : showLateActions
                ? "تجاوزنا 10 دقائق، يمكن فتح متأخر أو تغيير القاعة."
                : showExtension
                  ? "نهاية المحاضرة، يمكن طلب تمديد الجلسة."
                  : "بانتظار بداية المحاضرة حسب الجدول."}
          </div>
        </section>
      </div>
    </section>
  );
}
