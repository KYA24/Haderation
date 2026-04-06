import { getAdminOverview } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function AdminFacultyPage() {
  const data = await getAdminOverview();

  return (
    <section className="card p-5 md:p-6">
      <div>
        <p className="text-sm font-black text-[var(--kfu-green-700)]">أعضاء هيئة التدريس</p>
        <h2 className="mt-2 text-3xl font-black text-[var(--ink-900)]">مؤشر الاستخدام حسب العضو</h2>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.facultySummary.map((faculty) => (
          <article key={faculty.id} className="glass-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-black text-[var(--ink-900)]">{faculty.name}</h3>
                <p className="mt-1 text-sm text-[var(--ink-700)]">{faculty.department}</p>
              </div>
              <div className="rounded-full bg-[var(--kfu-green-100)] px-4 py-3 text-center text-[var(--kfu-green-800)]">
                <p className="text-2xl font-black leading-none">{faculty.exceptionCount}</p>
                <p className="mt-1 text-[11px] font-black">طلبات</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
