import { JobsPlatformAdd } from "./jobs-platform-add";
import { JobsPlatformList } from "./jobs-platform-list";
import { JobsWorkflowButton } from "./jobs-workflow-button";
import type { UseJobsWorkspaceResult } from "@/features/types/jobs/workspace";

export function JobsPlatformSection(props: UseJobsWorkspaceResult) {
  return (
    <div className="space-y-4">
      <JobsPlatformAdd 
        customPlatformName={props.customPlatformName} 
        setCustomPlatformName={props.setCustomPlatformName} 
        addCustomPlatform={props.addCustomPlatform} 
      />
      <JobsPlatformList 
        visiblePlatforms={props.visiblePlatforms} 
        updatePlatform={props.updatePlatform} 
        hidePlatform={props.hidePlatform} 
      />
      <JobsWorkflowButton 
        isPending={props.isPending} 
        runWorkflow={props.runWorkflow} 
      />
    </div>
  );
}
