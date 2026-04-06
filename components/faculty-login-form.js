"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, IdCard } from "lucide-react";

export default function FacultyLoginForm({ facultyId = "f001" }) {
  const router = useRouter();
  const [universityId, setUniversityId] = useState("");

  const handleSend = (event) => {
    event.preventDefault();
    router.push(`/faculty/otp?facultyId=${facultyId}&academicId=${encodeURIComponent(universityId)}`);
  };

  return (
    <form onSubmit={handleSend} className="space-y-4">
      <div>
        <label className="text-xs font-bold text-[var(--ink-700)]">الرقم الجامعي</label>
        <input
          className="input mt-2"
          placeholder="مثال: 20241042"
          value={universityId}
          onChange={(event) => setUniversityId(event.target.value)}
          required
        />
      </div>
      <button type="submit" className="button-primary w-full">
        <IdCard className="h-4 w-4" />
        المتابعة إلى التحقق
      </button>
      <div className="flex items-center justify-between text-xs text-[var(--ink-700)]">
        <span>يتم الانتقال لصفحة OTP للتأكيد.</span>
        <ArrowLeft className="h-4 w-4" />
      </div>
    </form>
  );
}
