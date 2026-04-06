"use client";

import { useEffect, useState } from "react";
import { Mic } from "lucide-react";

export default function MicFab() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("mic-active", active);
    return () => document.body.classList.remove("mic-active");
  }, [active]);

  return (
    <button
      type="button"
      className={`mic-fab ${active ? "listening" : ""}`}
      onClick={() => setActive((value) => !value)}
      aria-label="تشغيل الميكروفون"
    >
      <Mic className="h-7 w-7" />
    </button>
  );
}
