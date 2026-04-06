import KpiCard from "@/components/kpi-card";
import AdminCharts from "@/components/admin-charts";
import IntegrationCard from "@/components/integration-card";
import { AlertTriangle, Building2, DoorOpen, Users } from "lucide-react";
import { getAdminOverview } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const data = await getAdminOverview();
  const trend = data.charts.energyTrend;
  const peakPoint = trend.reduce((max, entry) => (entry.load > max.load ? entry : max), trend[0]);
  const averageLoad = trend.reduce((sum, entry) => sum + entry.load, 0) / Math.max(1, trend.length);
  const buildingLoads = data.rooms.reduce((accumulator, room) => {
    accumulator[room.building] = (accumulator[room.building] || 0) + room.currentLoadKw;
    return accumulator;
  }, {});
  const [topBuilding, topLoad] = Object.entries(buildingLoads).sort((a, b) => b[1] - a[1])[0] || [
    "—",
    0,
  ];

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
          <p className="text-sm font-black text-[var(--kfu-green-700)]">البيانات التنبئية</p>
          <h2 className="mt-2 text-3xl font-black text-[var(--ink-900)]">توقعات الحمل التشغيلي</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="glass-card p-4">
            <p className="text-xs font-bold text-[var(--ink-700)]">ذروة متوقعة اليوم</p>
            <p className="mt-2 text-2xl font-black text-[var(--kfu-green-800)]">{peakPoint.label}</p>
            <p className="mt-1 text-xs text-[var(--ink-700)]">{peakPoint.load} kW</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-bold text-[var(--ink-700)]">متوسط الحمل المستهدف</p>
            <p className="mt-2 text-2xl font-black text-[var(--kfu-green-800)]">
              {Math.round(averageLoad * 10) / 10} kW
            </p>
            <p className="mt-1 text-xs text-[var(--ink-700)]">بناءً على بيانات التشغيل الحالية</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-bold text-[var(--ink-700)]">أعلى استهلاك مبنى</p>
            <p className="mt-2 text-base font-black text-[var(--ink-900)]">{topBuilding}</p>
            <p className="mt-1 text-xs text-[var(--ink-700)]">{Math.round(topLoad * 10) / 10} kW</p>
          </div>
        </div>
      </section>

      <section className="card p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-[var(--kfu-green-700)]">ذكاء القرار</p>
            <h2 className="mt-2 text-3xl font-black text-[var(--ink-900)]">تنبؤات ومقترحات تشغيلية</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--ink-700)]">
              صفحة مستقلة تعرض توصيات الذكاء الاصطناعي بناءً على بيانات التشغيل (عرض تجريبي).
            </p>
          </div>
          <a href="/admin/insights" className="button-primary">
            عرض صفحة المقترحات
          </a>
        </div>
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
