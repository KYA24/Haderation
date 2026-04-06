export default function KpiCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="kpi p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[var(--ink-700)]">{title}</p>
          <p className="mt-3 text-4xl font-black text-[var(--kfu-green-900)]">{value}</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[var(--kfu-green-100)] text-[var(--kfu-green-800)]">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-[var(--ink-700)]">{subtitle}</p>
      <div className="gold-line mt-5" />
    </div>
  );
}
