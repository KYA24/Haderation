import { formatDateTime } from "@/lib/domain";

export default function LogFeed({ logs }) {
  return (
    <div className="mt-4 space-y-3">
      {logs.map((log) => (
        <div key={log.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold">{log.action}</p>
              <p className="mt-1 text-sm text-slate-400">{log.facultyName}</p>
            </div>
            <p className="text-xs text-slate-500">{formatDateTime(log.timestamp)}</p>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-300">{log.details}</p>
          <p className="mt-3 font-mono text-xs text-cyan-300">{log.txHash}</p>
        </div>
      ))}
    </div>
  );
}
