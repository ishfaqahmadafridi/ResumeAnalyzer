import { TimelineCardHeader } from "./timeline-card-header";
import { TimelineCardStats } from "./timeline-card-stats";
import { TimelineCardPreview } from "./timeline-card-preview";
import type { CVHistoryItemType } from "@/features/types/cv/history";

interface Props {
  cv: CVHistoryItemType;
  active: boolean;
  onSelectCv: (id: string) => void;
}

export function TimelineCard({ cv, active, onSelectCv }: Props) {
  return (
    <button
      onClick={() => onSelectCv(cv.id)}
      className={`overflow-hidden rounded-[24px] border px-5 py-5 text-left transition ${
        active
          ? "border-emerald-700 bg-[linear-gradient(135deg,rgba(217,243,225,0.96),rgba(255,255,255,0.96))]"
          : "border-black/10 bg-white/84 hover:bg-stone-50"
      }`}
    >
      <TimelineCardHeader createdAt={cv.created_at} score={cv.latest_analysis?.score} />
      <TimelineCardStats
        isVerified={cv.latest_verification?.is_verified}
        fullJsonState={cv.latest_analysis?.full_json_state}
      />
      <TimelineCardPreview rawText={cv.raw_text} details={cv.latest_verification?.details} />
    </button>
  );
}
