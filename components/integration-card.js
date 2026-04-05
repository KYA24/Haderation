import { Blocks, Cable, CalendarRange } from "lucide-react";

const iconMap = {
  timetable: CalendarRange,
  iot: Cable,
  blockchain: Blocks,
};

export default function IntegrationCard({ integration }) {
  const Icon = iconMap[integration.type] || Blocks;

  return (
    <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-black/20 p-3">
            <Icon className="h-5 w-5 text-[var(--accent-2)]" />
          </div>
          <div>
            <p className="font-bold">{integration.title}</p>
            <p className="text-sm text-slate-400">{integration.subtitle}</p>
          </div>
        </div>
        <span className="badge border border-white/8 bg-white/[0.05] text-slate-200">
          {integration.status}
        </span>
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-300">{integration.description}</p>
    </div>
  );
}
