import { Download, GitCompareArrows, Save, Sparkles } from "lucide-react";
import type { UpdateCVToolbarProps } from "@/features/cv/types/toolbar";

export function ToolbarActions({
  aiStatus,
  saving,
  showCompare,
  setShowCompare,
  onAIImprove,
  onSave,
  onDownload,
}: UpdateCVToolbarProps) {
  return (
    <>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-3 py-2 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-600"
        onClick={() => {
          void onAIImprove();
        }}
      >
        <Sparkles className="h-4 w-4" />
        {aiStatus === "pending" ? "Improving..." : "AI Improve"}
      </button>

      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-50"
        onClick={() => setShowCompare(!showCompare)}
      >
        <GitCompareArrows className="h-4 w-4" />
        Compare Changes
      </button>

      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-50"
        onClick={onDownload}
      >
        <Download className="h-4 w-4" />
        Download CV
      </button>

      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
        onClick={() => {
          void onSave();
        }}
      >
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : "Update Existing CV"}
      </button>
    </>
  );
}
