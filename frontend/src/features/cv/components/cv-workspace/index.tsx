"use client";

import { useCVWorkspace } from "@/features/hooks/cv/use-cv-workspace";
import { WorkspaceHeaderLayout } from "./workspace-header-layout";
import { WorkspaceRolesGrid } from "./workspace-roles-grid";
import { WorkspaceStructuredPreview } from "./workspace-structured-preview";

export function CVWorkspace() {
  const workspaceData = useCVWorkspace();

  return (
    <div className="space-y-6">
      <WorkspaceHeaderLayout {...workspaceData} />
      <WorkspaceRolesGrid {...workspaceData} />
      <WorkspaceStructuredPreview {...workspaceData} />
    </div>
  );
}
