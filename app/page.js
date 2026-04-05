import Link from "next/link";
import { ArrowLeft, Building2, Cpu, GraduationCap, ShieldCheck, Zap } from "lucide-react";
import AppShell from "@/components/app-shell";
import BlockchainBadge from "@/components/blockchain-badge";
import IntegrationCard from "@/components/integration-card";
import { getAdminOverview, getFacultyPortalData } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [admin, facultyPortal] = await Promise.all([
    getAdminOverview(),
    getFacultyPortalData("f001"),
  ]);

  return (
    <AppShell>
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-5 py-6 md:px-8">
        <header className="card shell-grid overflow-hidden p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="badge border border-white/10 bg-white/5 text-sm text-slate-200">
                  <Zap className="h-4 w-4 text-[var(--accent)]" />
                  إدارة طاقة القاعات الذكية
                </span>
                <BlockchainBadge />
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                  منارة الصف الذكي
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  منصة عربية أولًا لتشغيل الكهرباء داخل القاعات الدراسية بذكاء، مع
                  تتبع لحظي للجلسات، استثناءات فورية، وسجل تدقيق موثوق لجامعات
                  المملكة.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="kpi p-4">
                  <p className="text-sm text-slate-400">القاعات المتصلة</p>
                  <p className="mt-2 text-3xl font-black">{admin.kpis.totalRooms}</p>
                </div>
                <div className="kpi p-4">
                  <p className="text-sm text-slate-400">جلسات اليوم</p>
                  <p className="mt-2 text-3xl font-black">{admin.kpis.todaysSessions}</p>
                </div>
                <div className="kpi p-4">
                  <p className="text-sm text-slate-400">استجابة الاستثناءات</p>
                  <p className="mt-2 text-3xl font-black">{admin.kpis.approvalRate}%</p>
                </div>
              </div>
            </div>

            <div className="grid w-full max-w-xl gap-4">
              <div className="card glow p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-400">بوابة الإدارة</p>
                    <p className="mt-2 text-2xl font-extrabold">تحكم شامل ومؤشرات حية</p>
                  </div>
                  <Building2 className="h-10 w-10 text-[var(--accent)]" />
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  مراقبة حالة القاعات، مراجعة الطلبات الاستثنائية، ومتابعة السجل
                  التشغيلي والتدقيق.
                </p>
                <Link href="/admin" className="button-primary mt-5 inline-flex items-center gap-2">
                  الدخول إلى الإدارة
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>

              <div className="card p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-400">بوابة عضو هيئة التدريس</p>
                    <p className="mt-2 text-2xl font-extrabold">{facultyPortal.faculty.name}</p>
                  </div>
                  <GraduationCap className="h-10 w-10 text-[var(--accent-2)]" />
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  عرض الجلسة الحالية، طلب فتح متأخر، نقل قاعة، أو تمديد الجلسة
                  بتجربة سريعة مناسبة للعرض.
                </p>
                <Link href="/faculty" className="button-secondary mt-5 inline-flex items-center gap-2">
                  الدخول كعضو هيئة تدريس
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[var(--success)]" />
              <h2 className="text-xl font-extrabold">تجربة دخول مبسطة</h2>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Link href="/admin" className="rounded-3xl border border-white/8 bg-white/[0.03] p-5 transition hover:border-[var(--accent)]/40 hover:bg-white/[0.05]">
                <p className="text-sm text-slate-400">المسار 01</p>
                <h3 className="mt-2 text-2xl font-bold">مركز الطاقة الجامعي</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  مؤشرات لحظية، مراجعات الاستثناءات، وتكاملات النظام الذكي.
                </p>
              </Link>
              <Link href="/faculty" className="rounded-3xl border border-white/8 bg-white/[0.03] p-5 transition hover:border-[var(--accent-2)]/40 hover:bg-white/[0.05]">
                <p className="text-sm text-slate-400">المسار 02</p>
                <h3 className="mt-2 text-2xl font-bold">واجهة عضو هيئة التدريس</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  تفعيل متأخر عبر QR، تغيير القاعة، وتمديد الجلسة مع سجل موثق.
                </p>
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3">
              <Cpu className="h-5 w-5 text-[var(--accent)]" />
              <h2 className="text-xl font-extrabold">التكاملات التجريبية</h2>
            </div>
            <div className="mt-5 grid gap-4">
              {admin.integrations.map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
            </div>
          </div>
        </section>
      </section>
    </AppShell>
  );
}
