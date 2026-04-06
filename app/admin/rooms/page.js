import StatusBadge from "@/components/status-badge";
import { formatDateTime, getAdminOverview } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function AdminRoomsPage() {
  const data = await getAdminOverview();

  return (
    <section className="card p-5 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-black text-[var(--kfu-green-700)]">القاعات</p>
          <h2 className="mt-2 text-3xl font-black text-[var(--ink-900)]">إدارة القاعات وحالتها الحالية</h2>
        </div>
        <p className="text-sm font-bold text-[var(--ink-700)]">آخر تحديث: {formatDateTime(data.generatedAt)}</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {data.rooms.map((room) => (
          <article key={room.id} className="glass-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-[var(--ink-900)]">{room.name}</h3>
                <p className="mt-1 text-sm text-[var(--ink-700)]">{room.building} • سعة {room.capacity} طالب</p>
              </div>
              <StatusBadge status={room.state} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[20px] bg-[var(--surface-soft)] p-4">
                <p className="text-xs font-bold text-[var(--ink-700)]">الطاقة</p>
                <p className="mt-2 text-lg font-black text-[var(--kfu-green-800)]">{room.powerOn ? "مفعلة" : "مغلقة"}</p>
              </div>
              <div className="rounded-[20px] bg-[var(--surface-soft)] p-4">
                <p className="text-xs font-bold text-[var(--ink-700)]">الحمل الحالي</p>
                <p className="mt-2 text-lg font-black text-[var(--kfu-green-800)]">{room.currentLoadKw} kW</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm text-[var(--ink-700)]">
              <p>المقرر الحالي: {room.activeCourse || "لا توجد جلسة نشطة"}</p>
              <p>عضو هيئة التدريس: {room.activeFaculty || "—"}</p>
              <p>آخر نبضة: {formatDateTime(room.lastHeartbeat)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
