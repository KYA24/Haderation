import AppShell from "@/components/app-shell";
import AdminSidebar from "@/components/admin-sidebar";
import BlockchainBadge from "@/components/blockchain-badge";

export default function AdminLayout({ children }) {
  return (
    <AppShell>
      <main className="mx-auto min-h-screen w-full max-w-7xl px-5 py-6 md:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-[var(--accent)]">بوابة الإدارة</p>
            <h1 className="mt-2 text-3xl font-black">إدارة الطاقة الذكية</h1>
            <p className="mt-2 text-sm text-slate-400">واجهة مقسمة حسب الصفحات: رئيسية، قاعات، طلبات، أعضاء، وسجل.</p>
          </div>
          <BlockchainBadge />
        </div>

        <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          <AdminSidebar />
          <div className="min-w-0">{children}</div>
        </div>
      </main>
    </AppShell>
  );
}
