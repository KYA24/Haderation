import FacultyDashboard from "@/components/faculty-dashboard";
import { getFacultyPortalData } from "@/lib/domain";
import Link from "next/link";
import { BellRing, House, Mic, QrCode, UserRound } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FacultyHomePage({ searchParams }) {
  const params = await searchParams;
  const facultyId = params?.facultyId || "f001";
  const data = await getFacultyPortalData(facultyId);

  return (
    <main className="page-wrap py-3 md:py-6">
      <div className="mobile-frame relative">
        <header className="hero-banner px-5 pb-6 pt-4">
          <div className="mobile-notch" />
          <div className="mt-5 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-white/80">بوابة عضو هيئة التدريس</p>
              <h1 className="mt-1 text-xl font-black text-white">{data.faculty.name}</h1>
              <p className="text-xs text-white/75">{data.faculty.department}</p>
            </div>
            <div className="rounded-full bg-white/14 px-3 py-2 text-xs font-black text-white">
              {data.session.remainingMinutes} دقيقة
            </div>
          </div>
        </header>

        <div className="mobile-content">
          <FacultyDashboard initialData={data} />
        </div>

        <div className="mic-fab" aria-hidden="true">
          <Mic className="h-7 w-7" />
        </div>

        <nav className="bottom-nav">
          <Link href={`/faculty/home?facultyId=${data.faculty.id}`} className="bottom-nav-item active">
            <House className="h-5 w-5" />
            الرئيسية
          </Link>
          <a href="#services" className="bottom-nav-item">
            <QrCode className="h-5 w-5" />
            الخدمات
          </a>
          <a href="#requests" className="bottom-nav-item">
            <BellRing className="h-5 w-5" />
            الطلبات
          </a>
          <Link href="/faculty" className="bottom-nav-item">
            <UserRound className="h-5 w-5" />
            الحساب
          </Link>
        </nav>
      </div>
    </main>
  );
}
