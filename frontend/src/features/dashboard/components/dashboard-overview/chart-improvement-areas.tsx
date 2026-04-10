import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/ui/section-card";
import { useHydrated } from "@/hooks/use-hydrated";
import type { ImprovementDataType } from "@/features/types/dashboard";

export function ChartImprovementAreas({ improvementData }: { improvementData: ImprovementDataType[] }) {
  const hydrated = useHydrated();
  const dataToUse = improvementData.length ? improvementData : [{ skill: "Upload CV", weight: 80 }];
  return (
    <SectionCard title="Improvement Areas" description="Top missing skills blocking stronger role fit.">
      <div className="h-[250px]">
        {hydrated ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataToUse}>
              <CartesianGrid stroke="#ebe4d8" vertical={false} />
              <XAxis dataKey="skill" hide />
              <YAxis hide />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar dataKey="weight" radius={[18, 18, 6, 6]} fill="#c76b2f" />
            </BarChart>
          </ResponsiveContainer>
        ) : null}
      </div>
    </SectionCard>
  );
}
