import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/section-card";
import { useHydrated } from "@/hooks/use-hydrated";
import type { StackedMonthlyType } from "@/features/types/dashboard";

export function ChartStackedBar({ stackedData }: { stackedData: StackedMonthlyType[] }) {
  const hydrated = useHydrated();
  return (
    <SectionCard title="Platform Activity Mix" description="How your CV work, interview prep, and applications stack up across the year.">
      <div className="h-82.5">
        {hydrated ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stackedData}>
              <CartesianGrid stroke="#ebe4d8" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar dataKey="cv" stackId="a" fill="#365f93" radius={[0, 0, 0, 0]} />
              <Bar dataKey="interviews" stackId="a" fill="#f0a928" radius={[0, 0, 0, 0]} />
              <Bar dataKey="apply" stackId="a" fill="#18a957" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : null}
      </div>
    </SectionCard>
  );
}
