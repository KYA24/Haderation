import Link from "next/link";
import MicFab from "@/components/mic-fab";
import { getFacultyPortalData } from "@/lib/domain";
import { CalendarClock, CalendarDays, House, PencilLine, UserRound } from "lucide-react";

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

export default async function FacultySchedulePage({ searchParams }) {
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
              <p className="text-sm font-bold text-white/80">الجدول الدراسي</p>
              <h1 className="mt-1 text-xl font-black text-white">{data.faculty.name}</h1>
              <p className="text-xs text-white/75">{data.faculty.department}</p>
            </div>
            <div className="rounded-full bg-white/14 px-3 py-2 text-xs font-black text-white">
              {weekDays[schedule.weekday].label}
            </div>
          </div>
        </header>

        <div className="mobile-content">
          <section className="glass-card p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[var(--kfu-green-700)]">اليوم المحدد</p>
                <h2 className="mt-1 text-lg font-black text-[var(--ink-900)]">{schedule.courseName}</h2>
              </div>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--kfu-green-800)]"
                aria-label="تعديل الموعد"
              >
                <PencilLine className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 rounded-[16px] bg-[var(--surface-soft)] px-4 py-3 text-sm font-bold text-[var(--ink-700)]">
              {schedule.courseCode} • الشعبة {schedule.section}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-[var(--ink-700)]">
              <span>{schedule.startTime}</span>
              <CalendarClock className="h-4 w-4 text-[var(--kfu-green-800)]" />
              <span>{schedule.endTime}</span>
            </div>
          </section>

          <section className="mt-4 glass-card p-4">
            <p className="text-xs font-bold text-[var(--kfu-green-700)]">الأسبوع</p>
            <div className="mt-3 grid gap-2">
              {weekDays.map((day) => {
                const active = day.id === schedule.weekday;
                return (
                  <div
                    key={day.id}
                    className={`flex items-center justify-between rounded-[16px] border px-4 py-3 text-sm font-bold ${
                      active
                        ? "border-[var(--kfu-green-700)] bg-[var(--kfu-green-100)] text-[var(--kfu-green-800)]"
                        : "border-[var(--line)] bg-white text-[var(--ink-700)]"
                    }`}
                  >
                    <span>{day.label}</span>
                    <span>{active ? `${schedule.startTime} - ${schedule.endTime}` : "—"}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <MicFab />

        <nav className="bottom-nav">
          <Link href={`/faculty/home?${query}`} className="bottom-nav-item">
            <House className="h-5 w-5" />
            الرئيسية
          </Link>
          <Link href={`/faculty/schedule?${query}`} className="bottom-nav-item active">
            <CalendarDays className="h-5 w-5" />
            الجدول
          </Link>
          <Link href={`/faculty/profile?${query}`} className="bottom-nav-item">
            <UserRound className="h-5 w-5" />
            الحساب
          </Link>
        </nav>
      </div>
    </main>
  );
}
