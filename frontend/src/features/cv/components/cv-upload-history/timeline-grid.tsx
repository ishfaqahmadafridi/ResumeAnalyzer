import { TimelineCard } from "./timeline-card";
import type { CVHistoryItemType } from "@/features/types/cv/history";

interface Props {
  recentCvs: CVHistoryItemType[];
  selectedCvId: string | null;
  onSelectCv: (id: string) => void;
}

export function TimelineGrid({ recentCvs, selectedCvId, onSelectCv }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {recentCvs.map((cv) => (
        <TimelineCard
          key={cv.id}
          cv={cv}
          active={selectedCvId === cv.id}
          onSelectCv={onSelectCv}
        />
      ))}
    </div>
  );
}
