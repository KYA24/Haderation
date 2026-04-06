import StartLectureButton from "@/components/start-lecture-button";
import { getFacultyPortalData } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function FacultyWaitingPage({ searchParams }) {
  const params = await searchParams;
  const facultyId = params?.facultyId || "f001";
  const data = await getFacultyPortalData(facultyId);

  return (
    <main className="page-wrap py-3 md:py-6">
      <div className="mobile-frame relative">
        <header className="hero-banner px-5 pb-6 pt-4">
          <div className="mobile-notch" />
          <div className="mt-5">
            <p className="text-sm font-bold text-white/80">وضع الانتظار</p>
            <h1 className="mt-1 text-xl font-black text-white">بانتظار وصول الدكتور للقاعة</h1>
            <p className="mt-2 text-xs text-white/75">{data.faculty.name} • {data.faculty.department}</p>
          </div>
        </header>

        <div className="mobile-content">
          <section className="glass-card p-4">
            <p className="text-xs font-bold text-[var(--kfu-green-700)]">معلومات المحاضرة</p>
            <div className="mt-3 space-y-3 text-sm font-bold text-[var(--ink-700)]">
              <div className="flex items-center justify-between rounded-[16px] border border-[var(--line)] bg-white px-4 py-3">
                <span>المقرر</span>
                <span className="text-[var(--ink-900)]">{data.session.courseName}</span>
              </div>
              <div className="flex items-center justify-between rounded-[16px] border border-[var(--line)] bg-white px-4 py-3">
                <span>القاعة</span>
                <span className="text-[var(--ink-900)]">{data.session.room.name}</span>
              </div>
            </div>
          </section>

          <section className="mt-4 glass-card p-4">
            <p className="text-xs font-bold text-[var(--kfu-green-700)]">جاهزية التشغيل</p>
            <p className="mt-2 text-sm leading-7 text-[var(--ink-700)]">
              عند وصول الدكتور، اضغط زر البدء لتفعيل الإضاءة والمرافق الكهربائية وبدء العد التنازلي.
            </p>
            <div className="mt-4">
              <StartLectureButton facultyId={data.faculty.id} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
