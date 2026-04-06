import Link from "next/link";
import AppShell from "@/components/app-shell";
import BrandMark from "@/components/brand-mark";
import FacultyLoginForm from "@/components/faculty-login-form";
import { LogIn, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FacultyLoginPage() {
  return (
    <AppShell>
      <main className="page-wrap flex min-h-screen items-center justify-center">
        <section className="card grid w-full max-w-4xl overflow-hidden lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hero-banner px-6 py-10 md:px-10">
            <BrandMark className="[&_p]:text-white" />
            <h1 className="mt-8 text-4xl font-black leading-tight text-white">بوابة عضو هيئة التدريس</h1>
            <div className="mt-8 rounded-[22px] bg-white/10 p-5 text-white/92">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-[#f6edd8]" />
                <p className="font-black">دخول سريع</p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="mx-auto max-w-md">
              <p className="text-sm font-black text-[var(--kfu-green-700)]">تسجيل سريع</p>
              <h2 className="mt-2 text-3xl font-black text-[var(--ink-900)]">ادخل بياناتك الجامعية</h2>

              <div className="mt-6">
                <FacultyLoginForm />
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
