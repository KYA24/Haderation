import StatusBadge from "@/components/status-badge";
import { formatDateTime, getAdminOverview } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function AdminRoomsPage() {
  const data = await getAdminOverview();

  return (
    <section className="card p-5 md:p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">القاعات</p>
          <h2 className="text-2xl font-black">إدارة القاعات وحالتها</h2>
        </div>
        <p className="text-sm text-slate-400">آخر تحديث: {formatDateTime(data.generatedAt)}</p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {data.rooms.map((room) => (
          <div key={room.id} className="rounded-3xl border border-white/8 bg-white/[0.03] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold">{room.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{room.building} • سعة {room.capacity} طالب</p>
              </div>
              <StatusBadge status={room.state} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-black/20 p-3">
                <p className="text-xs text-slate-400">الطاقة</p>
                <p className={`mt-2 text-lg font-bold ${room.powerOn ? "text-emerald-300" : "text-slate-200"}`}>{room.powerOn ? "مفعلة" : "مغلقة"}</p>
              </div>
              <div className="rounded-2xl bg-black/20 p-3">
                <p className="text-xs text-slate-400">الحمل الحالي</p>
                <p className="mt-2 text-lg font-bold">{room.currentLoadKw} kW</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <p>المقرر الحالي: {room.activeCourse || "لا توجد جلسة نشطة"}</p>
              <p>عضو هيئة التدريس: {room.activeFaculty || "—"}</p>
              <p>آخر نبضة: {formatDateTime(room.lastHeartbeat)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
