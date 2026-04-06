"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";

export default function FacultyOtpForm({ facultyId = "f001", academicId = "" }) {
  const router = useRouter();
  const [otp, setOtp] = useState("");

  const handleVerify = (event) => {
    event.preventDefault();
    const loginAt = Date.now();
    router.push(`/faculty/home?facultyId=${facultyId}&loginAt=${loginAt}`);
  };

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <div className="rounded-[16px] bg-[var(--surface-soft)] px-4 py-3 text-xs font-bold text-[var(--ink-700)]">
        الرقم الجامعي: {academicId || "—"}
      </div>
      <div>
        <label className="text-xs font-bold text-[var(--ink-700)]">رمز التحقق (OTP)</label>
        <input
          className="input mt-2"
          placeholder="أدخل الرمز التجريبي"
          value={otp}
          onChange={(event) => setOtp(event.target.value)}
          required
        />
      </div>
      <button type="submit" className="button-primary w-full">
        <KeyRound className="h-4 w-4" />
        تأكيد وبدء المحاضرة
      </button>
      <div className="text-xs text-[var(--ink-700)]">OTP تجريبي فقط (لا يتم إرسال فعلي).</div>
    </form>
  );
}
