"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Building2, ClipboardList, Home, ScrollText, Users } from "lucide-react";

const items = [
  { href: "/admin", label: "الرئيسية", icon: BarChart3 },
  { href: "/admin/rooms", label: "القاعات", icon: Building2 },
  { href: "/admin/requests", label: "الطلبات", icon: ClipboardList },
  { href: "/admin/faculty", label: "أعضاء الهيئة", icon: Users },
  { href: "/admin/logs", label: "السجل", icon: ScrollText },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="card sticky top-4 h-fit p-4 md:p-5">
      <div className="mb-5 border-b border-white/8 pb-4">
        <p className="text-xs font-bold text-[var(--accent)]">ADMIN</p>
        <h2 className="mt-2 text-xl font-black">مركز الإدارة</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">تنقل بسيط وواضح، وكل صفحة لوحدها.</p>
      </div>

      <nav className="space-y-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                active
                  ? "bg-[var(--accent)] text-[#141414]"
                  : "bg-white/[0.03] text-slate-200 hover:bg-white/[0.06]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/"
        className="mt-4 flex items-center gap-3 rounded-2xl border border-white/8 px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/[0.04]"
      >
        <Home className="h-4 w-4" />
        الصفحة الرئيسية
      </Link>
    </aside>
  );
}
