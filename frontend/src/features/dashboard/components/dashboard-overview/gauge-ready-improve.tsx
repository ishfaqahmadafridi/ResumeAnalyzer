import { PolarAngleAxis, PolarGrid, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { SectionCard } from "@/components/section-card";
import { useHydrated } from "@/hooks/use-hydrated";

export function GaugeReadyImprove({ score }: { score: number }) {
  const hydrated = useHydrated();
  return (
    <SectionCard title="Ready to improve" description="How much room your CV still has to grow.">
      <div className="h-[210px]">
        {hydrated ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="68%" outerRadius="100%" data={[{ score: Math.max(100 - score, 12) }]} startAngle={90} endAngle={-270}>
              <PolarGrid radialLines={false} stroke="#e6ddd1" />
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="score" cornerRadius={18} fill="#18a957" />
            </RadialBarChart>
          </ResponsiveContainer>
        ) : null}
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
        <span>0</span>
        <span>{Math.max(100 - score, 0)} points</span>
        <span>100</span>
      </div>
    </SectionCard>
  );
}
