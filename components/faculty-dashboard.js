"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  ArrowRightLeft,
  DoorOpen,
  MessageCircle,
  Send,
  TimerReset,
  Zap,
} from "lucide-react";

const serviceMeta = {
  late_open: {
    title: "فتح متأخر",
    description: "إعادة تشغيل الطاقة بعد انتهاء نافذة التشغيل التلقائي.",
    reasons: ["تأخر وصول الطلبة", "تأخر تجهيز القاعة", "احتياج تشغيلي", "تعطل مفاجئ"],
  },
  room_change: {
    title: "تغيير قاعة",
    description: "تحويل المحاضرة إلى قاعة بديلة جاهزة.",
    reasons: ["خلل في التجهيزات", "سعة القاعة غير كافية", "عطل في الكهرباء", "سبب تشغيلي"],
  },
  extension: {
    title: "تمديد الجلسة",
    description: "تمديد الوقت في نهاية المحاضرة فقط.",
    reasons: ["استكمال الشرح", "نقاش إضافي", "تعويض تأخير", "نشاط عملي"],
  },
};

function formatClock(dateValue) {
  return new Intl.DateTimeFormat("ar-SA", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(dateValue));
}

function formatTime(dateValue) {
  return new Intl.DateTimeFormat("ar-SA", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateValue));
}

export default function FacultyDashboard({ initialData, initialStartedAt }) {
  const [data, setData] = useState(initialData);
  const [clock, setClock] = useState(Date.now());
  const [startedAt, setStartedAt] = useState(
    Number.isFinite(initialStartedAt) ? initialStartedAt : Date.now()
  );
  const [serviceType, setServiceType] = useState("late_open");
  const [reason, setReason] = useState(serviceMeta.late_open.reasons[0]);
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

  const now = new Date(clock);
  const startAt = new Date(data.session.startAt);
  const endAt = new Date(data.session.endAt);
  const durationMs = Math.max(0, endAt.getTime() - startAt.getTime());
  const sessionStart = startedAt ? new Date(startedAt) : startAt;
  const sessionEnd = new Date(sessionStart.getTime() + durationMs);
  const autoPowerEndsAt = startedAt ? new Date(startedAt + 10 * 60 * 1000) : null;
  const powerActive = Boolean(startedAt && autoPowerEndsAt && now <= autoPowerEndsAt);
  const afterAuto = Boolean(startedAt && autoPowerEndsAt && now > autoPowerEndsAt);
  const extensionWindowStart = new Date(sessionEnd.getTime() - 10 * 60 * 1000);
  const showExtension = Boolean(startedAt && now >= extensionWindowStart);
  const showLateActions = Boolean(startedAt && afterAuto && !showExtension);
  const isDark = Boolean(afterAuto && !showExtension);

  const activeService = serviceMeta[serviceType];
  const reasonOptions = useMemo(
    () => [...activeService.reasons, "أخرى"],
    [activeService.reasons]
  );

  useEffect(() => {
    if (showExtension) {
      setServiceType("extension");
    } else if (serviceType === "extension") {
      setServiceType("late_open");
    }
  }, [showExtension, serviceType]);

  useEffect(() => {
    setReason(serviceMeta[serviceType].reasons[0]);
    setNotes("");
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

  const submitRequest = (type) => {
    setFeedback("");
    setError("");

    const fullReason = [reason, notes.trim()].filter(Boolean).join(" - ");
    const payload = {
      type,
      reason: fullReason || serviceMeta[type].reasons[0],
    };

    if (type === "room_change") {
      payload.requestedRoomId = requestedRoomId;
    }

    if (type === "extension") {
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

  const handleStartLecture = () => {
    setStartedAt(Date.now());
    setFeedback("");
    setError("");
  };

  const roomOptions = useMemo(
    () => data.availableRooms.filter((room) => room.id !== data.session.room.id),
    [data.availableRooms, data.session.room.id]
  );

  return (
    <div className="space-y-4">
      <section className={`glass-card overflow-hidden ${isDark ? "lecture-dark" : ""}`}>
        <div className="hero-banner px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-white/70">الوقت</p>
              <p className="mt-1 text-2xl font-black text-white">{formatClock(clock)}</p>
            </div>
            <div className="rounded-full bg-white/15 px-4 py-2 text-xs font-black text-white">
              القاعة {data.session.room.name.replace("قاعة ", "")}
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs font-bold text-white/70">مادة المحاضرة</p>
            <h2 className="mt-1 text-xl font-black text-white">{data.session.courseName}</h2>
            <p className="mt-1 text-xs text-white/75">{data.session.courseCode} • الشعبة {data.session.section}</p>
          </div>
        </div>

        <div className="p-4">
          {!startedAt ? (
            <button type="button" className="button-primary w-full" onClick={handleStartLecture}>
              <DoorOpen className="h-4 w-4" />
              بدء المحاضرة وتشغيل المرافق
            </button>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className={`text-xs font-bold ${isDark ? "text-white/80" : "text-[var(--ink-700)]"}`}>
                {powerActive
                  ? "الطاقة مفعلة تلقائيًا لمدة 10 دقائق"
                  : showExtension
                    ? "نهاية المحاضرة - جاهز للتمديد"
                    : "الطاقة متوقفة - ارفع طلب فتح متأخر"}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--kfu-green-800)]">
                <Zap className="h-4 w-4" />
                {powerActive ? "تشغيل" : "إيقاف"}
              </div>
            </div>
          )}
        </div>
      </section>

      {startedAt ? (
        <section id="services" className="glass-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[var(--kfu-green-700)]">الخدمات</p>
              <h3 className="mt-1 text-lg font-black text-[var(--ink-900)]">{activeService.title}</h3>
              <p className="mt-1 text-xs text-[var(--ink-700)]">{activeService.description}</p>
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

          {showLateActions ? (
            <div className="mt-4 grid gap-3">
              <div className="flex flex-wrap gap-2">
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

              <div className="grid gap-2 md:grid-cols-2">
                <button
                  type="button"
                  className="button-primary w-full"
                  onClick={() => {
                    setServiceType("late_open");
                    submitRequest("late_open");
                  }}
                >
                  <DoorOpen className="h-4 w-4" />
                  فتح متأخر
                </button>
                <button
                  type="button"
                  className="button-secondary w-full"
                  onClick={() => setServiceType("room_change")}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  تغيير القاعة
                </button>
              </div>

              {serviceType === "room_change" ? (
                <div>
                  <select
                    className="select mt-2"
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
                  <button
                    type="button"
                    className="button-primary mt-3 w-full"
                    onClick={() => submitRequest("room_change")}
                    disabled={isPending || !requestedRoomId}
                  >
                    <Send className="h-4 w-4" />
                    رفع طلب تغيير القاعة
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}

          {showExtension ? (
            <div className="mt-4 grid gap-3">
              <select
                className="select"
                value={extensionMinutes}
                onChange={(event) => setExtensionMinutes(event.target.value)}
              >
                <option value="10">10 دقائق</option>
                <option value="15">15 دقيقة</option>
                <option value="20">20 دقيقة</option>
              </select>
              <button
                type="button"
                className="button-secondary w-full"
                onClick={() => submitRequest("extension")}
                disabled={isPending}
              >
                <TimerReset className="h-4 w-4" />
                تمديد الجلسة
              </button>
            </div>
          ) : null}

          {!showLateActions && !showExtension ? (
            <div className="mt-4 rounded-[16px] bg-[var(--surface-soft)] px-4 py-3 text-xs font-bold text-[var(--ink-700)]">
              الخدمات ستظهر عند انتهاء نافذة التشغيل أو قرب نهاية المحاضرة.
            </div>
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
        </section>
      ) : (
        <section id="services" className="glass-card p-4">
          <p className="text-sm font-bold text-[var(--ink-700)]">ابدأ المحاضرة لعرض الخدمات التشغيلية.</p>
        </section>
      )}

      <section id="requests" className="glass-card p-4">
        <div className="text-xs font-bold text-[var(--ink-700)]">آخر حالة مسجلة</div>
        <div className="mt-3 rounded-[16px] bg-[var(--surface-soft)] px-4 py-3 text-sm font-black text-[var(--ink-900)]">
          {data.latestRequestLabel}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-[var(--ink-700)]">
          <span>البداية {formatTime(sessionStart)}</span>
          <span>النهاية {formatTime(sessionEnd)}</span>
        </div>
      </section>
    </div>
  );
}
