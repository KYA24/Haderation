import FacultyDashboard from "@/components/faculty-dashboard";
import { getFacultyPortalData } from "@/lib/domain";
import Link from "next/link";
import { BellRing, House, QrCode, UserRound } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FacultyHomePage({ searchParams }) {
  const params = await searchParams;
  const facultyId = params?.facultyId || "f001";
  const data = await getFacultyPortalData(facultyId);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(102,211,255,0.12),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(241,200,77,0.1),_transparent_25%),#08090d] px-3 py-4 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-[34px] border border-white/8 bg-[#0d1118] shadow-[0_30px_80px_rgba(0,0,0,.45)]">
        <header className="border-b border-white/8 bg-white/[0.03] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[var(--accent)]">FACULTY APP</p>
              <h1 className="mt-1 text-lg font-black">{data.faculty.name}</h1>
              <p className="text-xs text-slate-400">{data.faculty.department}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-3 py-2 text-xs font-bold text-slate-200">
              <BellRing className="h-4 w-4 text-[var(--accent)]" />
              {data.session.remainingMinutes} دقيقة
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          <FacultyDashboard initialData={data} />
        </div>

        <nav className="grid grid-cols-4 border-t border-white/8 bg-[#0f131b] px-2 py-2">
          <Link href={`/faculty/home?facultyId=${data.faculty.id}`} className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-bold text-[var(--accent)]">
            <House className="h-5 w-5" />
            الرئيسية
          </Link>
          <a href="#services" className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-bold text-slate-300">
            <QrCode className="h-5 w-5" />
            الخدمات
          </a>
          <a href="#requests" className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-bold text-slate-300">
            <BellRing className="h-5 w-5" />
            الطلبات
          </a>
          <Link href="/faculty" className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-bold text-slate-300">
            <UserRound className="h-5 w-5" />
            الحساب
          </Link>
        </nav>
      </div>
    </main>
  );
}
