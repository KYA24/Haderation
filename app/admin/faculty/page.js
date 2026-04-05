import { getAdminOverview } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function AdminFacultyPage() {
  const data = await getAdminOverview();

  return (
    <section className="card p-5 md:p-6">
      <div>
        <p className="text-sm text-slate-400">أعضاء هيئة التدريس</p>
        <h2 className="text-2xl font-black">إجمالي الاستثناءات لكل عضو</h2>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {data.facultySummary.map((faculty) => (
          <div key={faculty.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-bold">{faculty.name}</p>
                <p className="text-sm text-slate-400">{faculty.department}</p>
              </div>
              <div className="text-left">
                <p className="text-2xl font-black">{faculty.exceptionCount}</p>
                <p className="text-xs text-slate-400">استثناء</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
