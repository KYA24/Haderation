import Link from "next/link";
import AppShell from "@/components/app-shell";
import BrandMark from "@/components/brand-mark";
import { getAdminOverview } from "@/lib/domain";
import { ChevronLeft, LogIn, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FacultyLoginPage() {
  const admin = await getAdminOverview();
  const facultyList = admin.facultySummary;

  return (
    <AppShell>
      <main className="page-wrap flex min-h-screen items-center justify-center">
        <section className="card grid w-full max-w-5xl overflow-hidden lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hero-banner px-6 py-10 md:px-10">
            <BrandMark className="[&_p]:text-white" />
            <h1 className="mt-8 text-4xl font-black leading-tight text-white">الدخول عبر الحساب الجامعي</h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/82">
              واجهة دخول شكلية مستوحاة من تطبيقات جامعة الملك فيصل، مع المحافظة على نفس التجربة الداخلية واختيار العضو للدخول السريع إلى الواجهة التجريبية.
            </p>
            <div className="mt-8 rounded-[28px] bg-white/10 p-5 text-white/92">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-[#f6edd8]" />
                <p className="font-black">الوصول موحد ومهيأ للجوال</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-white/78">
                القالب الجديد يركز على الوضوح، المساحات البيضاء، والتنقل السفلي الثابت لتجربة أكثر رسمية واتساقًا.
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="mx-auto max-w-md">
              <p className="text-sm font-black text-[var(--kfu-green-700)]">تسجيل افتراضي</p>
              <h2 className="mt-2 text-3xl font-black text-[var(--ink-900)]">اختر عضو هيئة التدريس</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-700)]">
                بدون توثيق حقيقي في هذه النسخة. اختر الحساب المناسب للدخول ومراجعة التجربة الجديدة.
              </p>

              <div className="mt-6 space-y-3">
                {facultyList.map((faculty) => (
                  <Link
                    key={faculty.id}
                    href={`/faculty/home?facultyId=${faculty.id}`}
                    className="glass-card flex items-center justify-between px-5 py-4 transition hover:-translate-y-1"
                  >
                    <div>
                      <p className="font-black text-[var(--ink-900)]">{faculty.name}</p>
                      <p className="mt-1 text-sm text-[var(--ink-700)]">{faculty.department}</p>
                    </div>
                    <ChevronLeft className="h-5 w-5 text-[var(--kfu-green-700)]" />
                  </Link>
                ))}
              </div>

              <Link href="/" className="button-secondary mt-6 w-full">
                <LogIn className="h-4 w-4" />
                العودة إلى الرئيسية
              </Link>
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
