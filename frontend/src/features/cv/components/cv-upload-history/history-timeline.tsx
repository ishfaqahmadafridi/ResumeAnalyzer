import { SectionCard } from "@/components/section-card";
import { TimelineGrid } from "./timeline-grid";
import { TimelineEmptyState } from "./timeline-empty-state";
import type { CVHistoryItemType } from "@/features/types/cv/history";

interface Props {
  recentCvs: CVHistoryItemType[];
  selectedCvId: string | null;
  isPending: boolean;
  onSelectCv: (id: string) => void;
}

export function HistoryTimeline({ recentCvs, selectedCvId, isPending, onSelectCv }: Props) {
  return (
    <SectionCard
      title="Upload Timeline"
      description="CV uploads from the last 7 days with extracted preview, verification state, and latest score."
      className="bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(245,248,243,0.88))]"
    >
      {recentCvs.length ? (
        <TimelineGrid recentCvs={recentCvs} selectedCvId={selectedCvId} onSelectCv={onSelectCv} />
      ) : (
        <TimelineEmptyState isPending={isPending} />
      )}
    </SectionCard>
  );
}
