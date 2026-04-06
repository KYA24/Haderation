"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  ArrowRightLeft,
  ChevronDown,
  DoorOpen,
  MessageCircle,
  Send,
  TimerReset,
} from "lucide-react";

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

export default function FacultyDashboard({ initialData }) {
  const [data, setData] = useState(initialData);
  const [clock, setClock] = useState(Date.now());
  const [serviceType, setServiceType] = useState("late_open");
  const [reason, setReason] = useState(serviceMeta.late_open.reasons[0]);
  const [serviceMenuOpen, setServiceMenuOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
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
  const reasonOptions = useMemo(
    () => [...activeService.reasons, "أخرى"],
    [activeService.reasons]
  );

  useEffect(() => {
    setReason(serviceMeta[serviceType].reasons[0]);
    setNotes("");
    setServiceMenuOpen(false);
    setNotesOpen(false);
  }, [serviceType]);

  useEffect(() => {
    if (reason === "أخرى") {
      setNotesOpen(true);
    }
  }, [reason]);

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

  const roomDigits = data.session.room.name.match(/\d+/)?.[0] || "";
  const roomFloor = roomDigits.charAt(0);
  const roomLabel =
    roomFloor === "1" ? "10XX" : roomFloor === "2" ? "20XX" : data.session.room.name;

  return (
    <div className="space-y-4">
      <section className="glass-card overflow-hidden">
        <div className="hero-banner px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-white/70">الوقت</p>
              <p className="mt-1 text-2xl font-black">{formatClock(clock)}</p>
            </div>
            <div className="rounded-full bg-white/15 px-4 py-2 text-xs font-black text-white">
              القاعة {roomLabel}
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs font-bold text-white/70">مادة المحاضرة</p>
            <h2 className="mt-1 text-xl font-black">{data.session.courseName}</h2>
            <p className="mt-1 text-xs text-white/75">{data.session.courseCode}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 px-5 py-3">
          <div className="text-xs text-[var(--ink-700)]">الشعبة {data.session.section}</div>
          <div className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs font-bold text-[var(--kfu-green-800)]">
            {data.session.phaseLabel}
          </div>
        </div>
      </section>

      <section id="services" className="glass-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-[var(--kfu-green-700)]">الخدمات</p>
            <h3 className="mt-1 text-lg font-black text-[var(--ink-900)]">{activeService.title}</h3>
          </div>
          <button
            type="button"
            className="field-button w-auto min-h-10 px-4 text-xs font-bold"
            onClick={() => setServiceMenuOpen((value) => !value)}
          >
            اختيار الخدمة
            <ChevronDown className={`h-4 w-4 transition ${serviceMenuOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {serviceMenuOpen ? (
          <div className="select-menu">
            {serviceCards.map((item) => {
              const Icon = item.icon;
              const active = item.key === serviceType;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setServiceType(item.key);
                    setServiceMenuOpen(false);
                  }}
                  className={`select-option ${active ? "active" : ""}`}
                >
                  <span className="flex items-center gap-2 font-bold">
                    <Icon className="h-4 w-4 text-[var(--kfu-green-800)]" />
                    {item.title}
                  </span>
                  {active ? (
                    <span className="text-xs font-bold text-[var(--kfu-green-800)]">محدد</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="mt-4 rounded-[24px] border border-[var(--line)] bg-[var(--surface-soft)] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--kfu-green-800)]">
                <ActiveServiceIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--ink-700)]">سبب الطلب</p>
                <p className="text-sm font-black text-[var(--ink-900)]">{reason}</p>
              </div>
            </div>
            <button
              type="button"
              className={`flex h-9 w-9 items-center justify-center rounded-full border text-[var(--kfu-green-800)] ${
                notesOpen ? "border-[var(--kfu-green-700)] bg-[var(--kfu-green-100)]" : "border-[var(--line)] bg-white"
              }`}
              onClick={() => setNotesOpen((value) => !value)}
              aria-label="إضافة ملاحظات"
            >
              <MessageCircle className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {reasonOptions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setReason(item)}
                className={`rounded-full border px-3 py-2 text-xs font-bold transition ${
                  reason === item
                    ? "border-[var(--kfu-green-700)] bg-[var(--kfu-green-100)] text-[var(--kfu-green-800)]"
                    : "border-[var(--line)] bg-white text-[var(--ink-700)]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {serviceType === "room_change" ? (
            <select
              className="select mt-4"
              value={requestedRoomId}
              onChange={(event) => setRequestedRoomId(event.target.value)}
            >
              <option value="">قاعة بديلة</option>
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

          {notesOpen ? (
            <textarea
              className="textarea mt-4"
              placeholder="ملاحظات إضافية (اختياري)"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          ) : null}

          {(error || feedback) ? (
            <div className="mt-4 rounded-[16px] bg-white px-4 py-3 text-xs font-bold text-[var(--ink-700)]">
              {error || feedback}
            </div>
          ) : null}

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
    </div>
  );
}
