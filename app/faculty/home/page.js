import FacultyDashboard from "@/components/faculty-dashboard";
import MicFab from "@/components/mic-fab";
import { getFacultyPortalData } from "@/lib/domain";
import Link from "next/link";
import { CalendarDays, House, UserRound } from "lucide-react";

export const dynamic = "force-dynamic";

function buildQuery(facultyId, loginAt) {
  const params = new URLSearchParams();
  params.set("facultyId", facultyId);
  if (loginAt) {
    params.set("loginAt", String(loginAt));
  }
  return params.toString();
}

export default async function FacultyHomePage({ searchParams }) {
  const params = await searchParams;
  const facultyId = params?.facultyId || "f001";
  const loginAtParam = params?.loginAt ? Number(params.loginAt) : null;
  const initialStartedAt = Number.isFinite(loginAtParam) ? loginAtParam : Date.now();
  const data = await getFacultyPortalData(facultyId);
  const query = buildQuery(data.faculty.id, loginAtParam);

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
          <FacultyDashboard initialData={data} initialStartedAt={initialStartedAt} />
        </div>

        <MicFab />

        <nav className="bottom-nav">
          <Link href={`/faculty/home?${query}`} className="bottom-nav-item active">
            <House className="h-5 w-5" />
            الرئيسية
          </Link>
          <Link href={`/faculty/schedule?${query}`} className="bottom-nav-item">
            <CalendarDays className="h-5 w-5" />
            الجدول
          </Link>
          <Link href={`/faculty/profile?${query}`} className="bottom-nav-item">
            <UserRound className="h-5 w-5" />
            الحساب
          </Link>
        </nav>
      </div>
    </main>
  );
}
