"use client";

import { useJobsWorkspace } from "@/features/hooks/jobs/use-jobs-workspace";
import { JobsWorkspaceLayout } from "./jobs-workspace-layout";

export function JobsWorkspace() {
  const workspaceData = useJobsWorkspace();

  return (
    <div className="space-y-6">
      <JobsWorkspaceLayout {...workspaceData} />
    </div>
  );
}
