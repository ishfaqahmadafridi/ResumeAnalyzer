import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/section-card";
import { useHydrated } from "@/hooks/use-hydrated";
import type { MatchBreakdownType } from "@/features/types/dashboard";

export function ChartRoleMatch({ matchData }: { matchData: MatchBreakdownType[] }) {
  const hydrated = useHydrated();
  return (
    <SectionCard title="Role Match Comparison" description="Current role recommendations and match percentages.">
      <div className="h-65">
        {hydrated ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={matchData} barCategoryGap={26}>
              <CartesianGrid vertical={false} stroke="#e8e2d7" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar dataKey="match" radius={[12, 12, 0, 0]}>
                {matchData.map((entry, index) => (
                  <Cell key={entry.name} fill={index === 0 ? "#36659a" : index === 1 ? "#f17c5b" : "#8398b6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : null}
      </div>
    </SectionCard>
  );
}
