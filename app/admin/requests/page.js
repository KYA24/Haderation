import AdminRequestReview from "@/components/admin-request-review";
import { getAdminOverview } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage() {
  const data = await getAdminOverview();

  return (
    <section className="card p-5 md:p-6">
      <div>
        <p className="text-sm text-slate-400">الطلبات</p>
        <h2 className="text-2xl font-black">مراجعة الطلبات الاستثنائية</h2>
      </div>
      <AdminRequestReview requests={data.requests} />
    </section>
  );
}
