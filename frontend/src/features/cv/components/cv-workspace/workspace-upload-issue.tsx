import type { UploadGuidanceType } from "@/features/types/cv/workspace";

export function WorkspaceUploadIssue({ uploadIssue }: { uploadIssue: UploadGuidanceType }) {
  return (
    <div className="mt-4 rounded-[22px] border border-red-200 bg-[linear-gradient(180deg,rgba(255,245,245,0.98),rgba(255,236,236,0.94))] px-4 py-4 text-red-800 shadow-[0_12px_28px_rgba(185,28,28,0.08)]">
      <p className="text-sm font-semibold">{uploadIssue.title}</p>
      <p className="mt-2 text-sm">{uploadIssue.summary}</p>
      <div className="mt-3 space-y-2 text-sm">
        {uploadIssue.steps.map((step) => (
          <p key={step}>{step}</p>
        ))}
      </div>
      <p className="mt-3 text-sm font-medium">{uploadIssue.tip}</p>
    </div>
  );
}
