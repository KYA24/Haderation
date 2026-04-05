"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
    <div className="mt-4 space-y-3">
      {requests.map((request) => (
        <div key={request.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold">{request.facultyName}</p>
              <p className="mt-1 text-sm text-slate-400">
                {request.typeLabel} • {request.roomName}
              </p>
            </div>
            <StatusBadge status={request.statusLabel} />
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-300">{request.reason}</p>
          {request.status === "pending" ? (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                className="button-primary"
                onClick={() => handleDecision(request.id, "approve")}
                disabled={isPending && pendingId === request.id}
              >
                اعتماد
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={() => handleDecision(request.id, "reject")}
                disabled={isPending && pendingId === request.id}
              >
                رفض
              </button>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-400">تمت معالجة هذا الطلب.</p>
          )}
        </div>
      ))}
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
