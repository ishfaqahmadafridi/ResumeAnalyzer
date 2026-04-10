import { WorkspaceWorkflowSteps } from "./workspace-workflow-steps";
import { WorkspaceWorkflowInfo } from "./workspace-workflow-info";

export function WorkspaceWorkflowGuide() {
  return (
    <div className="rounded-[30px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(252,249,244,0.94))] p-6 shadow-[0_20px_44px_rgba(56,56,40,0.06)]">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">Workflow guide</p>
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <WorkspaceWorkflowSteps />
        <WorkspaceWorkflowInfo />
      </div>
    </div>
  );
}
