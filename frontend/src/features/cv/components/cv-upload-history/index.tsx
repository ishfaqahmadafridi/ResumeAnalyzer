"use client";

import { useCVHistory } from "@/features/hooks/cv/use-cv-history";
import { HistoryHeader } from "./history-header";
import { HistoryTimeline } from "./history-timeline";

export function CVUploadHistory() {
  const {
    recentCvs,
    totalUploads,
    verifiedUploads,
    selectedCvId,
    isPending,
    onSelectCv,
  } = useCVHistory();

  return (
    <div className="space-y-6">
      <HistoryHeader totalUploads={totalUploads} verifiedUploads={verifiedUploads} />
      <HistoryTimeline
        recentCvs={recentCvs}
        selectedCvId={selectedCvId}
        isPending={isPending}
        onSelectCv={onSelectCv}
      />
    </div>
  );
}
