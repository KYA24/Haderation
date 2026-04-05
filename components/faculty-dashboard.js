"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { AlarmClockCheck, ArrowRightLeft, Blocks, Clock3, DoorOpen, QrCode, TimerReset } from "lucide-react";
import StatusBadge from "@/components/status-badge";

function formatClock(dateValue) {
  return new Intl.DateTimeFormat("ar-SA", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(dateValue));
}

function formatDateTime(dateValue) {
  return new Intl.DateTimeFormat("ar-SA", {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateValue));
}

export default function FacultyDashboard({ initialData }) {
  const [data, setData] = useState(initialData);
  const [clock, setClock] = useState(Date.now());
  const [lateReason, setLateReason] = useState("");
  const [roomReason, setRoomReason] = useState("");
  const [requestedRoomId, setRequestedRoomId] = useState("");
  const [extensionMinutes, setExtensionMinutes] = useState("15");
  const [extensionReason, setExtensionReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timer = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const roomOptions = useMemo(
    () => data.availableRooms.filter((room) => room.id !== data.session.room.id),
    [data.availableRooms, data.session.room.id]
  );

  const refreshSession = async () => {
    const response = await fetch(`/api/faculty/session?facultyId=${data.faculty.id}`);
    const nextData = await response.json();
    setData(nextData);
  };

  const submitRequest = (payload) => {
    setFeedback("");
    setError("");

    startTransition(async () => {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facultyId: data.faculty.id,
          ...payload,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "تعذر تنفيذ العملية");
        return;
      }

      setFeedback(result.message);
      setLateReason("");
      setRoomReason("");
      setRequestedRoomId("");
      setExtensionMinutes("15");
      setExtensionReason("");
      await refreshSession();
    });
  };

  const quickServices = [
    {
      title: "فتح متأخر",
      icon: QrCode,
      action: () => submitRequest({ type: "late_open", reason: lateReason || "تأخر الوصول للمحاضرة" }),
      tone: "text-[var(--accent)]",
    },
    {
      title: "تغيير قاعة",
      icon: ArrowRightLeft,
      action: () => submitRequest({ type: "room_change", reason: roomReason || "نقل بسبب حالة القاعة", requestedRoomId }),
      tone: "text-cyan-300",
    },
    {
      title: "تمديد",
      icon: TimerReset,
      action: () => submitRequest({ type: "extension", reason: extensionReason || "استكمال الشرح", requestedMinutes: Number(extensionMinutes) }),
      tone: "text-emerald-300",
    },
  ];

  return (
    <div className="space-y-3" id="services">
      <section className="rounded-[26px] border border-white/8 bg-white/[0.03] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-400">الجلسة الحالية</p>
            <h2 className="mt-1 text-xl font-black">{data.session.courseName}</h2>
            <p className="mt-1 text-xs text-slate-400">{data.session.courseCode} • الشعبة {data.session.section}</p>
          </div>
          <StatusBadge status={data.session.room.state} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-black/20 p-3">
            <p className="text-[11px] text-slate-400">الوقت</p>
            <p className="mt-2 text-lg font-black">{formatClock(clock)}</p>
          </div>
          <div className="rounded-2xl bg-black/20 p-3">
            <p className="text-[11px] text-slate-400">المتبقي</p>
            <p className="mt-2 text-lg font-black">{data.session.remainingMinutes}</p>
          </div>
          <div className="rounded-2xl bg-black/20 p-3">
            <p className="text-[11px] text-slate-400">الطاقة</p>
            <p className={`mt-2 text-base font-black ${data.session.powerOpen ? "text-emerald-300" : "text-amber-200"}`}>{data.session.powerOpen ? "مفتوحة" : "مغلقة"}</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-white/8 bg-black/20 p-3 text-sm leading-7 text-slate-300">
          <p>القاعة: {data.session.room.name}</p>
          <p>بداية المحاضرة: {formatDateTime(data.session.startAt)}</p>
          <p>نافذة التشغيل التلقائي حتى: {formatDateTime(data.session.autoOpenEndsAt)}</p>
        </div>

        {data.session.reminderActive ? (
          <div className="mt-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100">
            تبقى أقل من 5 دقائق. إذا تحتاج وقت إضافي ارفع طلب تمديد الآن.
          </div>
        ) : null}
      </section>

      <section className="rounded-[26px] border border-white/8 bg-white/[0.03] p-4">
        <div className="mb-3 flex items-center gap-2">
          <DoorOpen className="h-4 w-4 text-[var(--accent)]" />
          <h3 className="text-base font-black">الخدمات السريعة</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {quickServices.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                type="button"
                onClick={item.action}
                disabled={isPending || (item.title === "تغيير قاعة" && !requestedRoomId)}
                className="rounded-2xl border border-white/8 bg-black/20 px-2 py-4 text-center transition hover:bg-white/[0.05] disabled:opacity-50"
              >
                <Icon className={`mx-auto h-5 w-5 ${item.tone}`} />
                <p className="mt-2 text-xs font-bold">{item.title}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section id="requests" className="space-y-3">
        <div className="rounded-[26px] border border-white/8 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center gap-2">
            <QrCode className="h-4 w-4 text-[var(--accent)]" />
            <h3 className="text-base font-black">فتح متأخر</h3>
          </div>
          <textarea className="textarea" rows="3" placeholder="سبب الفتح المتأخر" value={lateReason} onChange={(e) => setLateReason(e.target.value)} />
        </div>

        <div className="rounded-[26px] border border-white/8 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-cyan-300" />
            <h3 className="text-base font-black">تغيير قاعة</h3>
          </div>
          <select className="select" value={requestedRoomId} onChange={(e) => setRequestedRoomId(e.target.value)}>
            <option value="">اختر القاعة البديلة</option>
            {roomOptions.map((room) => (
              <option key={room.id} value={room.id}>{room.name} - {room.building}</option>
            ))}
          </select>
          <textarea className="textarea mt-3" rows="3" placeholder="سبب تغيير القاعة" value={roomReason} onChange={(e) => setRoomReason(e.target.value)} />
        </div>

        <div className="rounded-[26px] border border-white/8 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center gap-2">
            <TimerReset className="h-4 w-4 text-emerald-300" />
            <h3 className="text-base font-black">تمديد الجلسة</h3>
          </div>
          <select className="select" value={extensionMinutes} onChange={(e) => setExtensionMinutes(e.target.value)}>
            <option value="10">10 دقائق</option>
            <option value="15">15 دقيقة</option>
            <option value="20">20 دقيقة</option>
          </select>
          <textarea className="textarea mt-3" rows="3" placeholder="سبب التمديد" value={extensionReason} onChange={(e) => setExtensionReason(e.target.value)} />
        </div>
      </section>

      <section className="grid gap-3">
        <div className="rounded-[26px] border border-white/8 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center gap-2">
            <Blocks className="h-4 w-4 text-emerald-300" />
            <h3 className="text-base font-black">توثيق blockchain</h3>
          </div>
          <p className="text-sm leading-7 text-slate-300">السجل محفوظ ببصمة تدقيق مرئية لإثبات كل قرار تشغيلي داخل النظام.</p>
        </div>

        <div className="rounded-[26px] border border-white/8 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center gap-2">
            <AlarmClockCheck className="h-4 w-4 text-cyan-300" />
            <h3 className="text-base font-black">آخر السجل</h3>
          </div>
          <div className="space-y-2">
            {data.logs.map((log) => (
              <div key={log.id} className="rounded-2xl bg-black/20 p-3">
                <p className="text-sm font-bold">{log.action}</p>
                <p className="mt-1 text-xs leading-6 text-slate-400">{log.details}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-white/8 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-amber-300" />
            <h3 className="text-base font-black">التغذية الراجعة</h3>
          </div>
          <div className="rounded-2xl bg-black/20 p-3 text-sm leading-7 text-slate-300">{error || feedback || "نفّذ أي خدمة من الأعلى وسيظهر الرد هنا مباشرة."}</div>
        </div>
      </section>
    </div>
  );
}
