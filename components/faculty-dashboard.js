"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  AlarmClockCheck,
  ArrowRightLeft,
  CheckCircle2,
  ChevronDown,
  Clock3,
  DoorOpen,
  Mic,
  Send,
  TimerReset,
} from "lucide-react";
import StatusBadge from "@/components/status-badge";

const serviceMeta = {
  late_open: {
    title: "فتح متأخر",
    icon: DoorOpen,
    accent: "text-[var(--kfu-green-800)]",
    description: "طلب فتح الكهرباء بعد انتهاء نافذة التشغيل التلقائي.",
    reasons: [
      "تأخر وصول الطلبة إلى القاعة",
      "تأخر عضو هيئة التدريس عن الوصول",
      "تأخر فتح المبنى أو البوابة",
      "احتياج تشغيلي مرتبط بالمحاضرة",
    ],
  },
  room_change: {
    title: "تغيير قاعة",
    icon: ArrowRightLeft,
    accent: "text-[var(--kfu-green-800)]",
    description: "تحويل المحاضرة إلى قاعة بديلة جاهزة بشكل فوري.",
    reasons: [
      "خلل في تجهيزات العرض",
      "عدم جاهزية التكييف أو الإضاءة",
      "سعة القاعة غير كافية",
      "احتياج أكاديمي أو تنظيمي",
    ],
  },
  extension: {
    title: "تمديد الجلسة",
    icon: TimerReset,
    accent: "text-[var(--kfu-green-800)]",
    description: "إضافة وقت قصير لاستكمال الشرح أو النشاط العملي.",
    reasons: [
      "استكمال الشرح",
      "استكمال نشاط عملي",
      "تأخر بداية المحاضرة",
      "نقاش وتقييم إضافي",
    ],
  },
};

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
  const [serviceType, setServiceType] = useState("late_open");
  const [reason, setReason] = useState(serviceMeta.late_open.reasons[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [requestedRoomId, setRequestedRoomId] = useState("");
  const [extensionMinutes, setExtensionMinutes] = useState("15");
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

  const activeService = serviceMeta[serviceType];
  const ActiveServiceIcon = activeService.icon;

  useEffect(() => {
    setReason(serviceMeta[serviceType].reasons[0]);
    setNotes("");
    setMenuOpen(false);
  }, [serviceType]);

  const refreshSession = async () => {
    const response = await fetch(`/api/faculty/session?facultyId=${data.faculty.id}`);
    const nextData = await response.json();
    setData(nextData);
  };

  const submitRequest = () => {
    setFeedback("");
    setError("");

    const fullReason = [reason, notes.trim()].filter(Boolean).join(" - ");
    const payload = {
      type: serviceType,
      reason: fullReason,
    };

    if (serviceType === "room_change") {
      payload.requestedRoomId = requestedRoomId;
    }

    if (serviceType === "extension") {
      payload.requestedMinutes = Number(extensionMinutes);
    }

    startTransition(async () => {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facultyId: data.faculty.id, ...payload }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "تعذر تنفيذ العملية");
        return;
      }

      setFeedback(result.message);
      setRequestedRoomId("");
      setExtensionMinutes("15");
      await refreshSession();
    });
  };

  const serviceCards = Object.entries(serviceMeta).map(([key, item]) => ({
    ...item,
    key,
  }));

  return (
    <div className="space-y-4">
      <section className="glass-card overflow-hidden">
        <div className="hero-banner px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-white/80">الجلسة الحالية</p>
              <h2 className="mt-2 text-2xl font-black">{data.session.courseName}</h2>
              <p className="mt-2 text-sm text-white/80">
                {data.session.courseCode} • الشعبة {data.session.section}
              </p>
            </div>
            <div className="rounded-full bg-white/14 px-4 py-2 text-sm font-black">
              {formatClock(clock)}
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-[20px] bg-[var(--surface-muted)] px-3 py-4">
              <p className="text-xs font-bold text-[var(--ink-700)]">الحالة</p>
              <p className="mt-2 text-sm font-black text-[var(--kfu-green-800)]">{data.session.phaseLabel}</p>
            </div>
            <div className="rounded-[20px] bg-[var(--surface-muted)] px-3 py-4">
              <p className="text-xs font-bold text-[var(--ink-700)]">المتبقي</p>
              <p className="mt-2 text-sm font-black text-[var(--kfu-green-800)]">{data.session.remainingMinutes} دقيقة</p>
            </div>
            <div className="rounded-[20px] bg-[var(--surface-muted)] px-3 py-4">
              <p className="text-xs font-bold text-[var(--ink-700)]">الطاقة</p>
              <p className="mt-2 text-sm font-black text-[var(--kfu-green-800)]">
                {data.session.powerOpen ? "مفعلة" : "مغلقة"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-[var(--ink-900)]">{data.session.room.name}</p>
              <p className="text-xs text-[var(--ink-700)]">نافذة التشغيل حتى {formatDateTime(data.session.autoOpenEndsAt)}</p>
            </div>
            <StatusBadge status={data.session.room.state} />
          </div>

          <div className="mt-4 rounded-[20px] bg-[var(--surface-soft)] px-4 py-4 text-sm leading-7 text-[var(--ink-700)]">
            {data.session.statusMessage}
          </div>
        </div>
      </section>

      <section id="services" className="glass-card p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-[var(--kfu-green-700)]">الخدمات السريعة</p>
            <h3 className="text-lg font-black text-[var(--ink-900)]">رفع الطلب من بطاقة موحدة</h3>
          </div>
          <div className="rounded-full bg-[var(--kfu-green-100)] px-3 py-2 text-xs font-black text-[var(--kfu-green-800)]">
            اعتماد مباشر
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {serviceCards.map((item) => {
            const Icon = item.icon;
            const active = item.key === serviceType;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setServiceType(item.key)}
                className={`rounded-[22px] border px-3 py-4 text-center transition ${
                  active
                    ? "border-[var(--kfu-green-700)] bg-[var(--kfu-green-100)]"
                    : "border-[var(--line)] bg-white"
                }`}
              >
                <Icon className="mx-auto h-6 w-6 text-[var(--kfu-green-800)]" />
                <p className="mt-2 text-xs font-black text-[var(--ink-900)]">{item.title}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-[24px] border border-[var(--line)] bg-[var(--surface-soft)] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--kfu-green-800)]">
              <ActiveServiceIcon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-black text-[var(--ink-900)]">{activeService.title}</h4>
              <p className="text-sm leading-7 text-[var(--ink-700)]">{activeService.description}</p>
            </div>
          </div>

          {serviceType === "room_change" ? (
            <select
              className="select mt-4"
              value={requestedRoomId}
              onChange={(event) => setRequestedRoomId(event.target.value)}
            >
              <option value="">اختر القاعة البديلة</option>
              {roomOptions.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} - {room.building}
                </option>
              ))}
            </select>
          ) : null}

          {serviceType === "extension" ? (
            <select
              className="select mt-4"
              value={extensionMinutes}
              onChange={(event) => setExtensionMinutes(event.target.value)}
            >
              <option value="10">10 دقائق</option>
              <option value="15">15 دقيقة</option>
              <option value="20">20 دقيقة</option>
            </select>
          ) : null}

          <div className="mt-4">
            <button type="button" className="field-button" onClick={() => setMenuOpen((value) => !value)}>
              <span>{reason}</span>
              <span className="flex items-center gap-2 text-[var(--ink-700)]">
                سبب الطلب
                <ChevronDown className={`h-4 w-4 transition ${menuOpen ? "rotate-180" : ""}`} />
              </span>
            </button>

            {menuOpen ? (
              <div className="select-menu">
                {activeService.reasons.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setReason(item);
                      setMenuOpen(false);
                    }}
                    className={`select-option ${reason === item ? "active" : ""}`}
                  >
                    <span className="font-bold">{item}</span>
                    {reason === item ? <CheckCircle2 className="h-5 w-5 text-[var(--kfu-green-800)]" /> : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <textarea
            className="textarea mt-4"
            placeholder="ملاحظات إضافية مرتبطة بالسبب المختار"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />

          <button
            type="button"
            onClick={submitRequest}
            disabled={isPending || (serviceType === "room_change" && !requestedRoomId)}
            className="button-primary mt-4 w-full"
          >
            <Send className="h-4 w-4" />
            رفع الطلب
          </button>
        </div>
      </section>

      <section id="requests" className="grid gap-4">
        <div className="glass-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <Mic className="h-4 w-4 text-[var(--kfu-gold-700)]" />
            <h3 className="text-base font-black text-[var(--ink-900)]">الأوامر الصوتية</h3>
          </div>
          <p className="text-sm leading-7 text-[var(--ink-700)]">
            زر الميكروفون ظاهر في الأسفل كتجهيز بصري لتجربة speech-to-text وتنفيذ الخدمات صوتيًا لاحقًا.
          </p>
        </div>

        <div className="glass-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-[var(--kfu-gold-700)]" />
            <h3 className="text-base font-black text-[var(--ink-900)]">حالة الطلب</h3>
          </div>
          <div className="rounded-[20px] bg-[var(--surface-soft)] p-4 text-sm leading-7 text-[var(--ink-700)]">
            {error || feedback || data.latestRequestLabel}
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <AlarmClockCheck className="h-4 w-4 text-[var(--kfu-green-800)]" />
            <h3 className="text-base font-black text-[var(--ink-900)]">آخر السجل</h3>
          </div>
          <div className="space-y-3">
            {data.logs.map((log) => (
              <div key={log.id} className="rounded-[20px] border border-[var(--line)] bg-white p-4">
                <p className="font-black text-[var(--ink-900)]">{log.action}</p>
                <p className="mt-1 text-sm leading-7 text-[var(--ink-700)]">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
