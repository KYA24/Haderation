import { Activity, Thermometer, Zap } from "lucide-react";
import { formatDateTime, getAdminOverview } from "@/lib/domain";

export const dynamic = "force-dynamic";

function deriveRangeLabel(rooms) {
  const digits = rooms
    .map((room) => room.name.match(/\d+/)?.[0])
    .filter(Boolean);
  const primary = digits[0] || "0";
  const floor = primary.charAt(0);
  if (floor === "1") return "10XX";
  if (floor === "2") return "20XX";
  if (floor === "3") return "30XX";
  if (floor === "4") return "40XX";
  return `${floor}0XX`;
}

export default async function AdminBmsPage() {
  const data = await getAdminOverview();
  const buildingGroups = data.rooms.reduce((accumulator, room) => {
    const group = accumulator[room.building] || [];
    group.push(room);
    accumulator[room.building] = group;
    return accumulator;
  }, {});

  const ranges = Object.entries(buildingGroups).map(([building, rooms]) => {
    const totalLoad = rooms.reduce((sum, room) => sum + room.currentLoadKw, 0);
    return {
      building,
      rooms,
      totalLoad,
      rangeLabel: deriveRangeLabel(rooms),
    };
  });

  const maxLoad = ranges.reduce((max, range) => Math.max(max, range.totalLoad), 0) || 1;
  const topRange = ranges.reduce(
    (max, range) => (range.totalLoad > max.totalLoad ? range : max),
    ranges[0] || { building: "—", totalLoad: 0 }
  );

  return (
    <section className="space-y-5">
      <section className="card p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black text-[var(--kfu-green-700)]">تكامل BMS</p>
            <h2 className="mt-2 text-3xl font-black text-[var(--ink-900)]">خريطة نطاقات استهلاك المباني</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--ink-700)]">
              الربط مع نظام إدارة المباني BMS يتيح رصد نطاقات كل مبنى. كل نطاق يجمع عدة قاعات ضمن
              نطاق طاقة واحد لمراقبة الأحمال الأعلى وإدارة الاستجابة التشغيلية.
            </p>
          </div>
          <div className="rounded-[18px] border border-[var(--line)] bg-[var(--surface-soft)] px-4 py-3 text-sm font-black text-[var(--ink-700)]">
            آخر تحديث: {formatDateTime(data.generatedAt)}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="glass-card p-4">
            <p className="text-xs font-bold text-[var(--ink-700)]">عدد النطاقات</p>
            <p className="mt-2 text-2xl font-black text-[var(--kfu-green-800)]">{ranges.length}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-bold text-[var(--ink-700)]">أعلى نطاق استهلاك</p>
            <p className="mt-2 text-base font-black text-[var(--ink-900)]">{topRange.building}</p>
            <p className="mt-1 text-xs text-[var(--ink-700)]">{Math.round(topRange.totalLoad * 10) / 10} kW</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-bold text-[var(--ink-700)]">إجمالي الأحمال</p>
            <p className="mt-2 text-2xl font-black text-[var(--kfu-green-800)]">
              {Math.round(
                ranges.reduce((sum, range) => sum + range.totalLoad, 0) * 10
              ) / 10}{" "}
              kW
            </p>
          </div>
        </div>
      </section>

      <section className="card p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-[var(--kfu-green-700)]">خريطة النطاقات</p>
            <h3 className="mt-2 text-2xl font-black text-[var(--ink-900)]">توزيع الحمل حسب المبنى</h3>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--ink-700)]">
            <Activity className="h-4 w-4 text-[var(--kfu-green-800)]" />
            مراقبة مستمرة
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {ranges.map((range) => {
            const isTop = range.building === topRange.building;
            return (
              <article
                key={range.building}
                className={`glass-card p-5 ${isTop ? "border-[var(--kfu-gold-700)]" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-[var(--ink-900)]">{range.building}</p>
                    <p className="mt-1 text-xs text-[var(--ink-700)]">النطاق: {range.rangeLabel}</p>
                  </div>
                  <div className="rounded-full bg-[var(--kfu-green-100)] px-3 py-2 text-xs font-black text-[var(--kfu-green-800)]">
                    {Math.round(range.totalLoad * 10) / 10} kW
                  </div>
                </div>

                <div className="mt-4">
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.min(100, (range.totalLoad / maxLoad) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 grid gap-2 text-xs text-[var(--ink-700)]">
                  {range.rooms.map((room) => (
                    <div key={room.id} className="flex items-center justify-between">
                      <span>{room.name}</span>
                      <span className="flex items-center gap-1 font-bold">
                        <Zap className="h-3 w-3 text-[var(--kfu-green-800)]" />
                        {room.currentLoadKw} kW
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[var(--ink-700)]">
                  <Thermometer className="h-4 w-4 text-[var(--kfu-gold-700)]" />
                  نطاق الطاقة يضم {range.rooms.length} قاعات ضمن {range.rangeLabel}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
}
