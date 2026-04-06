"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import StatusBadge from "@/components/status-badge";

export default function AdminRequestReview({ requests }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleDecision = (requestId, decision) => {
    setPendingId(requestId);
    setError("");

    startTransition(async () => {
      const response = await fetch(`/api/requests/${requestId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          reviewNote:
            decision === "approve"
              ? "تمت الموافقة من مركز التشغيل."
              : "تم رفض الطلب من مركز التشغيل.",
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || "تعذر تحديث حالة الطلب");
        setPendingId(null);
        return;
      }

      router.refresh();
      setPendingId(null);
    });
  };

  return (
    <div className="mt-5 grid gap-4">
      {requests.map((request) => (
        <article key={request.id} className="glass-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-black text-[var(--ink-900)]">{request.facultyName}</h3>
              <p className="mt-1 text-sm text-[var(--ink-700)]">
                {request.typeLabel} • {request.roomName}
              </p>
            </div>
            <StatusBadge status={request.statusLabel} />
          </div>

          <p className="mt-4 text-sm leading-7 text-[var(--ink-700)]">{request.reason}</p>

          {request.status === "pending" ? (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                className="button-primary"
                onClick={() => handleDecision(request.id, "approve")}
                disabled={isPending && pendingId === request.id}
              >
                <CheckCircle2 className="h-4 w-4" />
                اعتماد
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={() => handleDecision(request.id, "reject")}
                disabled={isPending && pendingId === request.id}
              >
                <XCircle className="h-4 w-4" />
                رفض
              </button>
            </div>
          ) : (
            <div className="mt-4 rounded-[18px] bg-[var(--surface-soft)] px-4 py-3 text-sm font-bold text-[var(--ink-700)]">
              تمت معالجة هذا الطلب، ويمكن مراجعته من السجل الكامل.
            </div>
          )}
        </article>
      ))}
      {error ? <p className="text-sm font-bold text-[var(--danger)]">{error}</p> : null}
    </div>
  );
}
