import { PolarAngleAxis, PolarGrid, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { SectionCard } from "@/components/ui/section-card";
import { useHydrated } from "@/hooks/use-hydrated";

export function GaugeTopBlockers({ missingCount }: { missingCount: number }) {
  const hydrated = useHydrated();
  return (
    <SectionCard title="Top blockers" description="Skill gaps slowing stronger role alignment.">
      <div className="h-[210px]">
        {hydrated ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="68%"
              outerRadius="100%"
              data={[{ score: Math.max(missingCount * 12, 18) }]}
              startAngle={90}
              endAngle={-270}
            >
              <PolarGrid radialLines={false} stroke="#e6ddd1" />
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="score" cornerRadius={18} fill="#f5a623" />
            </RadialBarChart>
          </ResponsiveContainer>
        ) : null}
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
        <span>0</span>
        <span>{missingCount} skills</span>
        <span>8+</span>
      </div>
    </SectionCard>
  );
}
