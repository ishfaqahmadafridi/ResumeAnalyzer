import { SectionCard } from "@/components/ui/section-card";
import { WorkspaceHeaderBanner } from "./workspace-header-banner";
import { WorkspaceWorkflowGuide } from "./workspace-workflow-guide";
import { WorkspaceUploadGrid } from "./workspace-upload-grid";
import type { UseCVWorkspaceResult } from "@/features/types/cv/workspace";

export function WorkspaceHeaderLayout(props: UseCVWorkspaceResult) {
  return (
    <SectionCard
      title="CV Analysis Workspace"
      description="Upload your latest resume, inspect role fit, and see the strongest next improvements."
      className="overflow-hidden border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,245,236,0.92))] p-7 lg:p-8"
    >
      <div className="space-y-5">
        <WorkspaceHeaderBanner recentCount={props.recentCvs.length} />
        <WorkspaceWorkflowGuide />
        <WorkspaceUploadGrid {...props} />
      </div>
    </SectionCard>
  );
}
