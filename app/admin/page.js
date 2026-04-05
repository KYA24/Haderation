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
        <KpiCard title="إجمالي القاعات" value={data.kpis.totalRooms} subtitle="قاعات مرتبطة بالنظام" icon={Building2} />
        <KpiCard title="جلسات اليوم" value={data.kpis.todaysSessions} subtitle="جلسات مجدولة اليوم" icon={DoorOpen} />
        <KpiCard title="طلبات الاستثناء" value={data.kpis.totalRequests} subtitle={`${data.kpis.pendingRequests} بانتظار المراجعة`} icon={AlertTriangle} />
        <KpiCard title="أعضاء الهيئة" value={data.kpis.totalFaculty} subtitle={`${data.kpis.totalExceptionsByFaculty} استثناء مسجل`} icon={Users} />
      </div>

      <div className="card p-5 md:p-6">
        <div className="mb-4">
          <p className="text-sm text-slate-400">الرئيسية</p>
          <h2 className="text-2xl font-black">الرسومات والمؤشرات فقط</h2>
        </div>
        <AdminCharts charts={data.charts} />
      </div>

      <div className="card p-5 md:p-6">
        <div className="mb-4">
          <p className="text-sm text-slate-400">التكاملات</p>
          <h2 className="text-2xl font-black">مؤشرات العرض التجريبي</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {data.integrations.map((integration) => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </div>
      </div>
    </section>
  );
}
