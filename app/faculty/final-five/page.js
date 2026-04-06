import { AlertTriangle, TimerReset } from "lucide-react";
import { getFacultyPortalData } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function FacultyFinalFivePage({ searchParams }) {
  const params = await searchParams;
  const facultyId = params?.facultyId || "f001";
  const data = await getFacultyPortalData(facultyId);

  return (
    <main className="page-wrap py-3 md:py-6">
      <div className="mobile-frame relative">
        <header className="hero-banner px-5 pb-6 pt-4 bg-[var(--danger)]">
          <div className="mobile-notch" />
          <div className="mt-5">
            <p className="text-sm font-bold text-white/85">تنبيه</p>
            <h1 className="mt-1 text-xl font-black text-white">تبقى 5 دقائق على نهاية المحاضرة</h1>
            <p className="mt-2 text-xs text-white/80">{data.session.courseName}</p>
          </div>
        </header>

        <div className="mobile-content">
          <section className="glass-card p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[var(--danger)]">تنبيه زمني</p>
                <p className="mt-2 text-sm font-black text-[var(--ink-900)]">باقي خمس دقائق</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(189,61,58,0.12)] text-[var(--danger)]">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 rounded-[16px] bg-[rgba(189,61,58,0.08)] px-4 py-3 text-sm font-bold text-[var(--danger)]">
              في حال الحاجة، يمكن رفع طلب تمديد الجلسة الآن.
            </div>
            <button type="button" className="button-secondary mt-4 w-full">
              <TimerReset className="h-4 w-4" />
              تمديد الجلسة
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
