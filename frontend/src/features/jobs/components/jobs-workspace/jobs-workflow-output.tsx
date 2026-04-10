import { SectionCard } from "@/components/section-card";
import { JobsWorkflowEmpty } from "./jobs-workflow-empty";
import { JobsWorkflowContent } from "./jobs-workflow-content";
import type { AgentWorkflowResult } from "@/types";

interface Props {
  workflow: AgentWorkflowResult | null;
}

export function JobsWorkflowOutput({ workflow }: Props) {
  return (
    <SectionCard title="Workflow Output" description="Current backend output from the orchestration endpoint." className="bg-white">
      {workflow ? <JobsWorkflowContent workflow={workflow} /> : <JobsWorkflowEmpty />}
    </SectionCard>
  );
}
