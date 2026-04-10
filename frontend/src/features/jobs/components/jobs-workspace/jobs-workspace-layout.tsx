import { SectionCard } from "@/components/section-card";
import { JobsPlatformSection } from "./jobs-platform-section";
import { JobsWorkflowSection } from "./jobs-workflow-section";
import type { UseJobsWorkspaceResult } from "@/features/types/jobs/workspace";

export function JobsWorkspaceLayout(props: UseJobsWorkspaceResult) {
  return (
    <SectionCard title="Platform Connections & Auto Apply" description="Connect public profiles, select target platforms, then trigger the backend workflow.">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <JobsPlatformSection {...props} />
        <JobsWorkflowSection {...props} />
      </div>
    </SectionCard>
  );
}
