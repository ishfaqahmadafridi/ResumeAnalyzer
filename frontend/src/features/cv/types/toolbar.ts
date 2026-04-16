export type UpdateCVToolbarProps = {
  aiStatus: "idle" | "pending" | "done" | "failed";
  saving: boolean;
  showCompare: boolean;
  setShowCompare: (value: boolean) => void;
  onAIImprove: () => Promise<void>;
  onSave: () => Promise<void>;
  onDownload: () => void;
};
