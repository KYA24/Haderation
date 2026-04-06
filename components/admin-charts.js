"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const palette = ["#146556", "#c89f3d", "#1d7b69", "#bd3d3a"];

export default function AdminCharts({ charts }) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <div className="glass-card p-4">
        <p className="mb-4 text-sm font-black text-[var(--ink-900)]">استهلاك الطاقة خلال اليوم</p>
        <div className="h-[280px] w-full">
          <ResponsiveContainer>
            <AreaChart data={charts.energyTrend}>
              <defs>
                <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#146556" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#146556" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#d9e5e1" vertical={false} />
              <XAxis dataKey="label" stroke="#6d8680" />
              <YAxis stroke="#6d8680" />
              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #d9e5e1",
                  borderRadius: "18px",
                }}
              />
              <Area type="monotone" dataKey="load" stroke="#146556" fill="url(#energyFill)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-4">
        <p className="mb-4 text-sm font-black text-[var(--ink-900)]">توزيع حالات القاعات</p>
        <div className="h-[280px] w-full">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={charts.roomStateDistribution} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={4}>
                {charts.roomStateDistribution.map((entry, index) => (
                  <Cell key={entry.name} fill={palette[index % palette.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #d9e5e1",
                  borderRadius: "18px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-4 xl:col-span-2">
        <p className="mb-4 text-sm font-black text-[var(--ink-900)]">أنواع الطلبات المرفوعة</p>
        <div className="h-[300px] w-full">
          <ResponsiveContainer>
            <BarChart data={charts.requestTypes}>
              <CartesianGrid stroke="#d9e5e1" vertical={false} />
              <XAxis dataKey="label" stroke="#6d8680" />
              <YAxis stroke="#6d8680" />
              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #d9e5e1",
                  borderRadius: "18px",
                }}
              />
              <Bar dataKey="count" fill="#c89f3d" radius={[16, 16, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
