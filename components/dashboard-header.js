import Link from "next/link";
import { Home, PanelRightOpen } from "lucide-react";

export default function DashboardHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="card p-6 md:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-bold text-[var(--accent)]">{eyebrow}</p>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">{title}</h1>
          <p className="max-w-2xl text-base leading-8 text-slate-300">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {actions}
          <Link href="/" className="button-secondary inline-flex items-center gap-2">
            <Home className="h-4 w-4" />
            الصفحة الرئيسية
          </Link>
          <Link href="/faculty?facultyId=f001" className="button-secondary inline-flex items-center gap-2">
            <PanelRightOpen className="h-4 w-4" />
            تجربة هيئة التدريس
          </Link>
        </div>
      </div>
    </header>
  );
}
