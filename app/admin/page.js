import KpiCard from "@/components/kpi-card";
import AdminCharts from "@/components/admin-charts";
import IntegrationCard from "@/components/integration-card";
import { AlertTriangle, Building2, DoorOpen, Users } from "lucide-react";
import { getAdminOverview } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const data = await getAdminOverview();

  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="إجمالي القاعات" value={data.kpis.totalRooms} subtitle="قاعات مرتبطة بمنصة التشغيل" icon={Building2} />
        <KpiCard title="جلسات اليوم" value={data.kpis.todaysSessions} subtitle="جلسات مجدولة حسب الجدول" icon={DoorOpen} />
        <KpiCard title="الطلبات" value={data.kpis.totalRequests} subtitle={`${data.kpis.pendingRequests} طلبات بانتظار المراجعة`} icon={AlertTriangle} />
        <KpiCard title="أعضاء الهيئة" value={data.kpis.totalFaculty} subtitle={`${data.kpis.totalExceptionsByFaculty} طلبات مسجلة إجمالاً`} icon={Users} />
      </div>

      <section className="card p-5 md:p-6">
        <div className="mb-5">
          <p className="text-sm font-black text-[var(--kfu-green-700)]">لوحة المؤشرات</p>
          <h2 className="mt-2 text-3xl font-black text-[var(--ink-900)]">ملخص تشغيلي حي</h2>
        </div>
        <AdminCharts charts={data.charts} />
      </section>

      <section className="card p-5 md:p-6">
        <div className="mb-5">
          <p className="text-sm font-black text-[var(--kfu-green-700)]">تكاملات النظام</p>
          <h2 className="mt-2 text-3xl font-black text-[var(--ink-900)]">الخدمات المرتبطة</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.integrations.map((integration) => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </div>
      </section>
    </section>
  );
}
