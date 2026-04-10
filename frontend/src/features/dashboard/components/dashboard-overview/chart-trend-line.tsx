import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/section-card";
import { useHydrated } from "@/hooks/use-hydrated";
import type { ActivityTrendType } from "@/features/types/dashboard";

export function ChartTrendLine({ trendData }: { trendData: ActivityTrendType[] }) {
  const hydrated = useHydrated();
  return (
    <SectionCard title="CV Momentum Trend" description="A board-style trend of your score against a stronger target path.">
      <div className="h-82.5">
        {hydrated ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid stroke="#ebe4d8" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#365f93" strokeWidth={3} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="target" stroke="#f0a928" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : null}
      </div>
    </SectionCard>
  );
}
