"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const palette = ["#f1c84d", "#66d3ff", "#2bd67b", "#ff7d7d"];

export default function AdminCharts({ charts }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="rounded-3xl border border-white/8 bg-black/20 p-4">
        <p className="mb-4 text-sm font-bold text-slate-300">استهلاك الطاقة خلال اليوم</p>
        <div className="overflow-x-auto">
          <AreaChart width={520} height={280} data={charts.energyTrend}>
            <defs>
              <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#66d3ff" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#66d3ff" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
            <XAxis dataKey="label" stroke="#aab0c0" />
            <YAxis stroke="#aab0c0" />
            <Tooltip
              contentStyle={{
                background: "#10131a",
                border: "1px solid rgba(255,255,255,.1)",
                borderRadius: "16px",
              }}
            />
            <Area
              type="monotone"
              dataKey="load"
              stroke="#66d3ff"
              fill="url(#energyFill)"
              strokeWidth={3}
            />
          </AreaChart>
        </div>
      </div>

      <div className="rounded-3xl border border-white/8 bg-black/20 p-4">
        <p className="mb-4 text-sm font-bold text-slate-300">توزيع حالات القاعات</p>
        <div className="overflow-x-auto">
          <PieChart width={520} height={280}>
            <Pie
              data={charts.roomStateDistribution}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={105}
              paddingAngle={3}
              cx="50%"
              cy="50%"
            >
              {charts.roomStateDistribution.map((entry, index) => (
                <Cell key={entry.name} fill={palette[index % palette.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#10131a",
                border: "1px solid rgba(255,255,255,.1)",
                borderRadius: "16px",
              }}
            />
          </PieChart>
        </div>
      </div>

      <div className="rounded-3xl border border-white/8 bg-black/20 p-4 xl:col-span-2">
        <p className="mb-4 text-sm font-bold text-slate-300">طلبات الاستثناء حسب النوع</p>
        <div className="overflow-x-auto">
          <BarChart width={1080} height={280} data={charts.requestTypes}>
            <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
            <XAxis dataKey="label" stroke="#aab0c0" />
            <YAxis stroke="#aab0c0" />
            <Tooltip
              contentStyle={{
                background: "#10131a",
                border: "1px solid rgba(255,255,255,.1)",
                borderRadius: "16px",
              }}
            />
            <Bar dataKey="count" fill="#f1c84d" radius={[14, 14, 0, 0]} />
          </BarChart>
        </div>
      </div>
    </div>
  );
}
