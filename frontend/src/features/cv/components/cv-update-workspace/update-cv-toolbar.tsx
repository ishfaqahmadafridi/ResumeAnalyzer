import { ToolbarActions } from "./workspace/toolbar-actions";
import type { UpdateCVToolbarProps } from "@/features/cv/types/toolbar";

export function UpdateCVToolbar({
  aiStatus,
  saving,
  showCompare,
  setShowCompare,
  onAIImprove,
  onSave,
  onDownload,
}: UpdateCVToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ToolbarActions
        aiStatus={aiStatus}
        saving={saving}
        showCompare={showCompare}
        setShowCompare={setShowCompare}
        onAIImprove={onAIImprove}
        onSave={onSave}
        onDownload={onDownload}
      />
    </div>
  );
}
