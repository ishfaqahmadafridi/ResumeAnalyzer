import { PolarAngleAxis, PolarGrid, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { SectionCard } from "@/components/ui/section-card";
import { useHydrated } from "@/hooks/use-hydrated";

export function GaugeCurrentRatio({ score }: { score: number }) {
  const hydrated = useHydrated();
  return (
    <SectionCard title="Current ratio" description="A quick dial for your present CV health.">
      <div className="h-[210px]">
        {hydrated ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="68%" outerRadius="100%" data={[{ score }]} startAngle={90} endAngle={-270}>
              <PolarGrid radialLines={false} stroke="#d6d0c4" />
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="score" cornerRadius={18} fill="#36659a" />
            </RadialBarChart>
          </ResponsiveContainer>
        ) : null}
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
        <span>0</span>
        <span>{score}%</span>
        <span>100</span>
      </div>
    </SectionCard>
  );
}
