import LogFeed from "@/components/log-feed";
import { getAdminOverview } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function AdminLogsPage() {
  const data = await getAdminOverview();

  return (
    <section className="card p-5 md:p-6">
      <div>
        <p className="text-sm text-slate-400">السجل</p>
        <h2 className="text-2xl font-black">السجل التشغيلي الكامل</h2>
      </div>
      <LogFeed logs={data.logs} />
    </section>
  );
}
