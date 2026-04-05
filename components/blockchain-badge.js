import { Blocks, ShieldCheck } from "lucide-react";

export default function BlockchainBadge() {
  return (
    <span className="badge border border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
      <Blocks className="h-4 w-4 text-cyan-300" />
      سجل تدقيق غير قابل للتعديل
      <ShieldCheck className="h-4 w-4 text-emerald-300" />
    </span>
  );
}
