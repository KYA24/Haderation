import Link from "next/link";
import { ArrowLeft, Building2, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import AppShell from "@/components/app-shell";
import BlockchainBadge from "@/components/blockchain-badge";
import BrandMark from "@/components/brand-mark";
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
      <main className="page-wrap">
        <section className="hero-banner card overflow-hidden px-6 py-8 md:px-8 md:py-10">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <BlockchainBadge />
                <span className="badge bg-white/10 text-white">واجهة مستوحاة من كفو KFU</span>
              </div>
              <div className="mt-6 max-w-3xl">
                <BrandMark className="text-white [&_p]:text-white" />
                <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
                  إعادة بناء واجهة هدرييشن بأسلوب جامعي رسمي، واضح، ومتجاوب بالكامل.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/82 md:text-lg">
                  تم توجيه القالب إلى طابع بصري قريب من جامعة الملك فيصل: مساحات بيضاء أوسع، درجات أخضر وذهبي، بطاقات خدمات أوضح، وتجربة جوال تحاكي التطبيقات الجامعية الرسمية.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/faculty" className="button-primary">
                  بوابة عضو هيئة التدريس
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <Link href="/faculty/waiting?facultyId=f001" className="button-secondary">
                  حالة انتظار وصول الدكتور
                </Link>
                <Link href="/admin" className="button-secondary">
                  لوحة الإدارة
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="glass-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[var(--kfu-green-700)]">العضو النشط</p>
                    <h2 className="mt-2 text-2xl font-black text-[var(--ink-900)]">{facultyPortal.faculty.name}</h2>
                    <p className="mt-1 text-sm text-[var(--ink-700)]">{facultyPortal.faculty.department}</p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--kfu-green-100)] text-[var(--kfu-green-800)]">
                    <GraduationCap className="h-7 w-7" />
                  </div>
                </div>
              </div>
              <div className="glass-card p-5">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-sm font-bold text-[var(--ink-700)]">القاعات</p>
                    <p className="mt-2 text-3xl font-black text-[var(--kfu-green-900)]">{admin.kpis.totalRooms}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--ink-700)]">جلسات اليوم</p>
                    <p className="mt-2 text-3xl font-black text-[var(--kfu-green-900)]">{admin.kpis.todaysSessions}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--ink-700)]">الاعتماد</p>
                    <p className="mt-2 text-3xl font-black text-[var(--kfu-green-900)]">{admin.kpis.approvalRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="card p-6 md:p-7">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[var(--kfu-green-800)]" />
              <h2 className="text-2xl font-black text-[var(--ink-900)]">مسارات الاستخدام</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Link href="/admin" className="glass-card p-5 transition hover:-translate-y-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--kfu-green-100)] text-[var(--kfu-green-800)]">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-black text-[var(--ink-900)]">لوحة الإدارة</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--ink-700)]">
                  متابعة القاعات، الطلبات، السجلات، ومؤشرات التشغيل من لوحة واحدة بطابع إداري رسمي.
                </p>
              </Link>
              <Link href="/faculty" className="glass-card p-5 transition hover:-translate-y-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--kfu-gold-100)] text-[var(--kfu-gold-700)]">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-black text-[var(--ink-900)]">تطبيق الجوال</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--ink-700)]">
                  واجهة جوال حقيقية بأسفل ثابت وزر صوتي مركزي وتجربة طلب موحدة أكثر قربًا من تطبيقات KFU.
                </p>
              </Link>
            </div>
          </div>

          <div className="card p-6 md:p-7">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[var(--kfu-gold-700)]" />
              <h2 className="text-2xl font-black text-[var(--ink-900)]">التكاملات</h2>
            </div>
            <div className="mt-6 grid gap-4">
              {admin.integrations.map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
