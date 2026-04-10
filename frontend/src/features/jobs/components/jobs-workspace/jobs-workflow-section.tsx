import { JobsWorkflowNodes } from "./jobs-workflow-nodes";
import { JobsWorkflowOutput } from "./jobs-workflow-output";
import { JobsHiddenPlatforms } from "./jobs-hidden-platforms";
import type { UseJobsWorkspaceResult } from "@/features/types/jobs/workspace";

export function JobsWorkflowSection(props: UseJobsWorkspaceResult) {
  return (
    <div className="space-y-4">
      <JobsWorkflowNodes />
      <JobsWorkflowOutput workflow={props.workflow} />
      <JobsHiddenPlatforms hiddenPlatforms={props.hiddenPlatforms} unhidePlatform={props.unhidePlatform} />
    </div>
  );
}
