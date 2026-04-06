"use client";

import { useRouter } from "next/navigation";
import { DoorOpen } from "lucide-react";

export default function StartLectureButton({ facultyId = "f001" }) {
  const router = useRouter();

  const handleStart = () => {
    const loginAt = Date.now();
    router.push(`/faculty/home?facultyId=${facultyId}&loginAt=${loginAt}`);
  };

  return (
    <button type="button" className="button-primary w-full" onClick={handleStart}>
      <DoorOpen className="h-4 w-4" />
      بدء المحاضرة وتشغيل المرافق
    </button>
  );
}
