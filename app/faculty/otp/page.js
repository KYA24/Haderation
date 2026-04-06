import Link from "next/link";
import AppShell from "@/components/app-shell";
import BrandMark from "@/components/brand-mark";
import FacultyOtpForm from "@/components/faculty-otp-form";
import { ArrowRight, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FacultyOtpPage({ searchParams }) {
  const params = await searchParams;
  const facultyId = params?.facultyId || "f001";
  const academicId = params?.academicId || "";

  return (
    <AppShell>
      <main className="page-wrap flex min-h-screen items-center justify-center">
        <section className="card grid w-full max-w-4xl overflow-hidden lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hero-banner px-6 py-10 md:px-10">
            <BrandMark className="[&_p]:text-white" />
            <h1 className="mt-8 text-4xl font-black leading-tight text-white">التحقق من الرمز</h1>
            <div className="mt-8 rounded-[22px] bg-white/10 p-5 text-white/92">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-[#f6edd8]" />
                <p className="font-black">OTP تجريبي</p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="mx-auto max-w-md">
              <p className="text-sm font-black text-[var(--kfu-green-700)]">الخطوة الثانية</p>
              <h2 className="mt-2 text-3xl font-black text-[var(--ink-900)]">أدخل رمز التحقق</h2>

              <div className="mt-6">
                <FacultyOtpForm facultyId={facultyId} academicId={academicId} />
              </div>

              <Link href="/faculty" className="button-secondary mt-6 w-full">
                <ArrowRight className="h-4 w-4" />
                الرجوع لتعديل الرقم الجامعي
              </Link>
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
