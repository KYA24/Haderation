import LogFeed from "@/components/log-feed";
import { getAdminOverview } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function AdminLogsPage() {
  const data = await getAdminOverview();

  return (
    <section className="card p-5 md:p-6">
      <div>
        <p className="text-sm font-black text-[var(--kfu-green-700)]">السجل</p>
        <h2 className="mt-2 text-3xl font-black text-[var(--ink-900)]">السجل التشغيلي الكامل</h2>
      </div>
      <LogFeed logs={data.logs} />
    </section>
  );
}
