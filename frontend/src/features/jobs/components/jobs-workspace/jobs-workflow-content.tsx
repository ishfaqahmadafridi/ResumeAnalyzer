import { JobsWorkflowNotifications } from "./jobs-workflow-notifications";
import { JobsWorkflowJobsList } from "./jobs-workflow-jobs-list";
import { JobsWorkflowApplications } from "./jobs-workflow-applications";
import type { AgentWorkflowResult } from "@/types";

interface Props {
  workflow: AgentWorkflowResult;
}

export function JobsWorkflowContent({ workflow }: Props) {
  return (
    <div className="space-y-5">
      <JobsWorkflowNotifications notifications={workflow.notifications} />
      <JobsWorkflowJobsList jobs={workflow.jobs} />
      <JobsWorkflowApplications applications={workflow.applications} />
    </div>
  );
}
