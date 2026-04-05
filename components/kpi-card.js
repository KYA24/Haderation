export default function KpiCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="kpi p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-3 text-4xl font-black text-white">{value}</p>
        </div>
        <div className="rounded-2xl bg-black/20 p-3">
          <Icon className="h-5 w-5 text-[var(--accent)]" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-300">{subtitle}</p>
    </div>
  );
}
