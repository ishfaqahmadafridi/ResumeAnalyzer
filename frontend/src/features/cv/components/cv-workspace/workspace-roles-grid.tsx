import { SectionCard } from "@/components/ui/section-card";
import { WorkspaceRolesRecommended } from "./workspace-roles-recommended";
import { WorkspaceFitBreakdown } from "./workspace-fit-breakdown";
import type { UseCVWorkspaceResult } from "@/features/types/cv/workspace";

export function WorkspaceRolesGrid(props: UseCVWorkspaceResult) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <SectionCard title="Recommended Roles" description="Choose the primary role you want this CV optimized for.">
        <WorkspaceRolesRecommended {...props} />
      </SectionCard>

      <SectionCard title="Role Fit Breakdown" description="Your extracted profile, matched skills, and the most useful next skills to add.">
        <WorkspaceFitBreakdown {...props} />
      </SectionCard>
    </div>
  );
}
