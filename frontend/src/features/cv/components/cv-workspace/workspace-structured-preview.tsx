import { SectionCard } from "@/components/section-card";
import { WorkspaceStructuredDetails } from "./workspace-structured-details";
import { WorkspaceStructuredSkills } from "./workspace-structured-skills";
import type { UseCVWorkspaceResult } from "@/features/types/cv/workspace";

export function WorkspaceStructuredPreview({ structured, detectedSkills }: UseCVWorkspaceResult) {
  return (
    <SectionCard title="Structured CV Preview" description="Parsed candidate details from the current CV.">
      <div className="grid gap-5 md:grid-cols-2">
        <WorkspaceStructuredDetails structured={structured} />
        <WorkspaceStructuredSkills detectedSkills={detectedSkills} />
      </div>
    </SectionCard>
  );
}
