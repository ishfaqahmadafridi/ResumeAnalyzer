import { WorkspaceUploadSection } from "./workspace-upload-section";
import { WorkspaceRecentLibrary } from "./workspace-recent-library";
import type { UseCVWorkspaceResult } from "@/features/types/cv/workspace";

export function WorkspaceUploadGrid(props: UseCVWorkspaceResult) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.02fr_1.08fr]">
      <WorkspaceUploadSection {...props} />
      <WorkspaceRecentLibrary {...props} />
    </div>
  );
}
