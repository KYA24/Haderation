import { Blocks, Cable, CalendarRange } from "lucide-react";

const iconMap = {
  timetable: CalendarRange,
  iot: Cable,
  blockchain: Blocks,
};

export default function IntegrationCard({ integration }) {
  const Icon = iconMap[integration.type] || Blocks;

  return (
    <article className="glass-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--kfu-gold-700)]/30 bg-[var(--surface-muted)] text-[var(--kfu-green-800)]">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-black text-[var(--ink-900)]">{integration.title}</h3>
            <p className="text-sm text-[var(--ink-700)]">{integration.subtitle}</p>
          </div>
        </div>
        <span className="badge bg-[var(--kfu-green-100)] text-[var(--kfu-green-800)]">{integration.status}</span>
      </div>
      <p className="mt-4 text-sm leading-7 text-[var(--ink-700)]">{integration.description}</p>
    </article>
  );
}
