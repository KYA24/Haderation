"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Building2, ClipboardList, Home, ScrollText, Users } from "lucide-react";
import BrandMark from "@/components/brand-mark";

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
    <aside className="card sticky top-5 h-fit p-5">
      <BrandMark compact />
      <div className="mt-5 rounded-[24px] bg-[var(--surface-soft)] p-4">
        <p className="text-sm font-black text-[var(--kfu-green-700)]">لوحة الإدارة</p>
        <p className="mt-2 text-sm leading-7 text-[var(--ink-700)]">
          تنقل جانبي ثابت وصفحات مستقلة للغرف والطلبات والأعضاء والسجل التشغيلي.
        </p>
      </div>

      <nav className="mt-5 grid gap-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm font-black transition ${
                active
                  ? "bg-[var(--kfu-green-800)] text-white"
                  : "bg-[var(--surface-soft)] text-[var(--ink-700)] hover:bg-[var(--kfu-green-100)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <Link href="/" className="button-secondary mt-5 w-full">
        <Home className="h-4 w-4" />
        الصفحة الرئيسية
      </Link>
    </aside>
  );
}
