import { Blocks, ShieldCheck } from "lucide-react";

export default function BlockchainBadge() {
  return (
    <span className="badge border border-[var(--line)] bg-[var(--surface)] text-[var(--kfu-green-900)]">
      <Blocks className="h-4 w-4 text-[var(--kfu-gold-700)]" />
      سجل تشغيلي موثق
      <ShieldCheck className="h-4 w-4 text-[var(--kfu-green-700)]" />
    </span>
  );
}
