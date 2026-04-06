import AppShell from "@/components/app-shell";
import AdminSidebar from "@/components/admin-sidebar";
import BlockchainBadge from "@/components/blockchain-badge";

export default function AdminLayout({ children }) {
  return (
    <AppShell>
      <main className="page-wrap">
        <section className="card mb-6 overflow-hidden">
          <div className="hero-banner px-6 py-7 md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white/80">بوابة الإدارة الجامعية</p>
                <h1 className="mt-2 text-4xl font-black text-white">مركز التحكم والخدمات</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">
                  إعادة تصميم كاملة لواجهة الإدارة مع نفس الخدمات والبيانات، لكن بطابع بصري جامعي أكثر رسمية ووضوحًا.
                </p>
              </div>
              <BlockchainBadge />
            </div>
          </div>
        </section>

        <div className="admin-grid">
          <AdminSidebar />
          <div className="min-w-0">{children}</div>
        </div>
      </main>
    </AppShell>
  );
}
