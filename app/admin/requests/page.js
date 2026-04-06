import AdminRequestReview from "@/components/admin-request-review";
import { getAdminOverview } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage() {
  const data = await getAdminOverview();

  return (
    <section className="card p-5 md:p-6">
      <div>
        <p className="text-sm font-black text-[var(--kfu-green-700)]">الطلبات</p>
        <h2 className="mt-2 text-3xl font-black text-[var(--ink-900)]">مراجعة الطلبات الاستثنائية</h2>
      </div>
      <AdminRequestReview requests={data.requests} />
    </section>
  );
}
