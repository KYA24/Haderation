import Link from "next/link";
import AppShell from "@/components/app-shell";
import { getAdminOverview } from "@/lib/domain";
import { ChevronLeft, LogIn, Smartphone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FacultyLoginPage() {
  const admin = await getAdminOverview();
  const facultyList = admin.facultySummary;

  return (
    <AppShell>
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-6">
        <section className="card p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[var(--accent)]">FACULTY APP</p>
              <h1 className="mt-2 text-2xl font-black">دخول افتراضي</h1>
              <p className="mt-2 text-sm leading-7 text-slate-400">بدون توثيق حقيقي — فقط اختر العضو وادخل للتجربة.</p>
            </div>
            <div className="rounded-3xl border border-white/8 bg-white/[0.04] p-3">
              <Smartphone className="h-7 w-7 text-[var(--accent)]" />
            </div>
          </div>

          <div className="space-y-3">
            {facultyList.map((faculty) => (
              <Link
                key={faculty.id}
                href={`/faculty/home?facultyId=${faculty.id}`}
                className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 transition hover:bg-white/[0.06]"
              >
                <div>
                  <p className="font-bold">{faculty.name}</p>
                  <p className="text-sm text-slate-400">{faculty.department}</p>
                </div>
                <ChevronLeft className="h-5 w-5 text-slate-400" />
              </Link>
            ))}
          </div>

          <Link href="/" className="button-secondary mt-5 inline-flex w-full items-center justify-center gap-2">
            <LogIn className="h-4 w-4" />
            العودة إلى الرئيسية
          </Link>
        </section>
      </main>
    </AppShell>
  );
}
