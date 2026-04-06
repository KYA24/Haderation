import { Lightbulb, ShieldAlert, Sparkles, TrendingUp, Zap } from "lucide-react";
import { getAdminOverview } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function AdminInsightsPage() {
  const data = await getAdminOverview();
  const trend = data.charts.energyTrend;
  const peakPoint = trend.reduce((max, entry) => (entry.load > max.load ? entry : max), trend[0]);
  const averageLoad = trend.reduce((sum, entry) => sum + entry.load, 0) / Math.max(1, trend.length);
  const topRoom = [...data.rooms].sort((a, b) => b.currentLoadKw - a.currentLoadKw)[0];
  const riskyRooms = data.rooms.filter((room) => room.state !== "سليمة");
  const pendingCount = data.kpis.pendingRequests;

  const recommendations = [
    {
      title: "تخفيف الذروة",
      detail: `الذروة المتوقعة عند ${peakPoint.label} بمتوسط ${peakPoint.load} kW.`,
    },
    {
      title: "إعادة توزيع القاعات",
      detail: `القاعة الأعلى استهلاكًا حاليًا: ${topRoom.name} (${topRoom.currentLoadKw} kW).`,
    },
    {
      title: "مخاطر تشغيلية",
      detail: riskyRooms.length
        ? `هناك ${riskyRooms.length} قاعات بحاجة متابعة (صيانة/تماس/إغلاق).`
        : "لا توجد قاعات حرجة حالياً.",
    },
  ];

  return (
    <section className="space-y-5">
      <section className="card p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black text-[var(--kfu-green-700)]">ذكاء القرار</p>
            <h2 className="mt-2 text-3xl font-black text-[var(--ink-900)]">تنبؤات ومقترحات تشغيلية</h2>
          </div>
          <div className="rounded-[18px] border border-[var(--line)] bg-[var(--surface-soft)] px-4 py-3 text-sm font-black text-[var(--ink-700)]">
            متوسط الحمل: {Math.round(averageLoad * 10) / 10} kW
          </div>
        </div>
      </section>

      <section className="card p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-[var(--kfu-green-700)]">تنبؤات اليوم</p>
            <h3 className="mt-2 text-2xl font-black text-[var(--ink-900)]">الذروة المتوقعة والأثر</h3>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--ink-700)]">
            <TrendingUp className="h-4 w-4 text-[var(--kfu-green-800)]" />
            نمذجة تجريبية
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="glass-card p-4">
            <p className="text-xs font-bold text-[var(--ink-700)]">نافذة الذروة</p>
            <p className="mt-2 text-2xl font-black text-[var(--kfu-green-800)]">{peakPoint.label}</p>
            <p className="mt-1 text-xs text-[var(--ink-700)]">{peakPoint.load} kW</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-bold text-[var(--ink-700)]">الطلبات المعلقة</p>
            <p className="mt-2 text-2xl font-black text-[var(--kfu-green-800)]">{pendingCount}</p>
            <p className="mt-1 text-xs text-[var(--ink-700)]">تحتاج مراجعة تشغيليّة</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-bold text-[var(--ink-700)]">نطاق BMS الأعلى</p>
            <p className="mt-2 text-base font-black text-[var(--ink-900)]">{topRoom.building}</p>
            <p className="mt-1 text-xs text-[var(--ink-700)]">يرصد أعلى حمل حالياً</p>
          </div>
        </div>
      </section>

      <section className="card p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-[var(--kfu-green-700)]">المقترحات</p>
            <h3 className="mt-2 text-2xl font-black text-[var(--ink-900)]">خطوات مقترحة لصانع القرار</h3>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--ink-700)]">
            <Sparkles className="h-4 w-4 text-[var(--kfu-green-800)]" />
            توصيات ذكية
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {recommendations.map((item) => (
            <div key={item.title} className="glass-card p-4">
              <p className="text-xs font-bold text-[var(--kfu-green-700)]">{item.title}</p>
              <p className="mt-2 text-sm font-black text-[var(--ink-900)]">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-[var(--kfu-green-700)]">تنبيهات مبكرة</p>
            <h3 className="mt-2 text-2xl font-black text-[var(--ink-900)]">مناطق تتطلب اهتمامًا</h3>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--ink-700)]">
            <ShieldAlert className="h-4 w-4 text-[var(--kfu-gold-700)]" />
            مراقبة استباقية
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 text-sm font-black text-[var(--ink-900)]">
              <Zap className="h-4 w-4 text-[var(--kfu-green-800)]" />
              غرف ذات استهلاك مرتفع
            </div>
            <div className="mt-3 space-y-2 text-xs text-[var(--ink-700)]">
              {data.rooms.slice(0, 3).map((room) => (
                <div key={room.id} className="flex items-center justify-between">
                  <span>{room.name}</span>
                  <span className="font-bold">{room.currentLoadKw} kW</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 text-sm font-black text-[var(--ink-900)]">
              <Lightbulb className="h-4 w-4 text-[var(--kfu-gold-700)]" />
              إجراء مقترح
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--ink-700)]">
              يُقترح تحويل بعض الجلسات إلى نطاقات أقل حملًا أو تفعيل وضع الترشيد في
              مباني الذروة خلال ساعة الذروة.
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}
