import { WorkspaceRolesCustomInput } from "./workspace-roles-custom-input";
import { WorkspaceRolesList } from "./workspace-roles-list";
import { WorkspaceRolesEmpty } from "./workspace-roles-empty";
import type { UseCVWorkspaceResult } from "@/features/types/cv/workspace";

export function WorkspaceRolesRecommended(props: UseCVWorkspaceResult) {
  return (
    <div className="space-y-3">
      <WorkspaceRolesCustomInput {...props} />
      {props.recommendedRoles.length ? (
        <WorkspaceRolesList {...props} />
      ) : (
        <WorkspaceRolesEmpty hasDetectedProfileSignals={props.hasDetectedProfileSignals} />
      )}
    </div>
  );
}
