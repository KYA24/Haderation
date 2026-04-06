import Link from "next/link";
import MicFab from "@/components/mic-fab";
import { getFacultyPortalData } from "@/lib/domain";
import { CalendarDays, House, Save, UserRound } from "lucide-react";

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

function buildQuery(facultyId, loginAt) {
  const params = new URLSearchParams();
  params.set("facultyId", facultyId);
  if (loginAt) {
    params.set("loginAt", String(loginAt));
  }
  return params.toString();
}

export default async function FacultyProfilePage({ searchParams }) {
  const params = await searchParams;
  const facultyId = params?.facultyId || "f001";
  const loginAtParam = params?.loginAt ? Number(params.loginAt) : null;
  const data = await getFacultyPortalData(facultyId);
  const query = buildQuery(data.faculty.id, loginAtParam);
  const schedule = data.faculty.schedule;

  return (
    <main className="page-wrap py-3 md:py-6">
      <div className="mobile-frame relative">
        <header className="hero-banner px-5 pb-6 pt-4">
          <div className="mobile-notch" />
          <div className="mt-5 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-white/80">ملف الحساب</p>
              <h1 className="mt-1 text-xl font-black text-white">{data.faculty.name}</h1>
              <p className="text-xs text-white/75">{data.faculty.department}</p>
            </div>
            <div className="rounded-full bg-white/14 px-3 py-2 text-xs font-black text-white">
              عضو هيئة تدريس
            </div>
          </div>
        </header>

        <div className="mobile-content">
          <section className="glass-card p-4">
            <p className="text-xs font-bold text-[var(--kfu-green-700)]">بيانات الدكتور</p>
            <div className="mt-3 space-y-3 text-sm font-bold text-[var(--ink-700)]">
              <div className="flex items-center justify-between rounded-[16px] border border-[var(--line)] bg-white px-4 py-3">
                <span>الاسم</span>
                <span className="text-[var(--ink-900)]">{data.faculty.name}</span>
              </div>
              <div className="flex items-center justify-between rounded-[16px] border border-[var(--line)] bg-white px-4 py-3">
                <span>القسم</span>
                <span className="text-[var(--ink-900)]">{data.faculty.department}</span>
              </div>
              <div className="flex items-center justify-between rounded-[16px] border border-[var(--line)] bg-white px-4 py-3">
                <span>القاعة الأساسية</span>
                <span className="text-[var(--ink-900)]">{data.session.room.name}</span>
              </div>
            </div>
          </section>

          <section className="mt-4 glass-card p-4">
            <p className="text-xs font-bold text-[var(--kfu-green-700)]">تعديل الجدول الدراسي</p>
            <div className="mt-3 grid gap-3">
              <label className="text-xs font-bold text-[var(--ink-700)]">اسم المقرر</label>
              <input className="input" defaultValue={schedule.courseName} />
              <label className="text-xs font-bold text-[var(--ink-700)]">رمز المقرر</label>
              <input className="input" defaultValue={schedule.courseCode} />
              <label className="text-xs font-bold text-[var(--ink-700)]">الشعبة</label>
              <input className="input" defaultValue={schedule.section} />
              <label className="text-xs font-bold text-[var(--ink-700)]">اليوم</label>
              <select className="select" defaultValue={schedule.weekday}>
                {weekDays.map((day) => (
                  <option key={day.id} value={day.id}>
                    {day.label}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[var(--ink-700)]">بداية المحاضرة</label>
                  <input className="input" defaultValue={schedule.startTime} />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--ink-700)]">نهاية المحاضرة</label>
                  <input className="input" defaultValue={schedule.endTime} />
                </div>
              </div>
              <button type="button" className="button-secondary w-full">
                <Save className="h-4 w-4" />
                حفظ التعديلات (تجريبي)
              </button>
            </div>
          </section>
        </div>

        <MicFab />

        <nav className="bottom-nav">
          <Link href={`/faculty/home?${query}`} className="bottom-nav-item">
            <House className="h-5 w-5" />
            الرئيسية
          </Link>
          <Link href={`/faculty/schedule?${query}`} className="bottom-nav-item">
            <CalendarDays className="h-5 w-5" />
            الجدول
          </Link>
          <Link href={`/faculty/profile?${query}`} className="bottom-nav-item active">
            <UserRound className="h-5 w-5" />
            الحساب
          </Link>
        </nav>
      </div>
    </main>
  );
}
