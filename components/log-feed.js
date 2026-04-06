import { formatDateTime } from "@/lib/domain";

export default function LogFeed({ logs }) {
  return (
    <div className="mt-5 grid gap-4">
      {logs.map((log) => (
        <article key={log.id} className="glass-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-black text-[var(--ink-900)]">{log.action}</h3>
              <p className="mt-1 text-sm text-[var(--ink-700)]">{log.facultyName}</p>
            </div>
            <p className="text-sm font-bold text-[var(--kfu-green-700)]">{formatDateTime(log.timestamp)}</p>
          </div>
          <p className="mt-4 text-sm leading-7 text-[var(--ink-700)]">{log.details}</p>
          <div className="mt-4 rounded-2xl bg-[var(--surface-muted)] px-4 py-3 font-mono text-xs text-[var(--kfu-green-800)]">
            {log.txHash}
          </div>
        </article>
      ))}
    </div>
  );
}
