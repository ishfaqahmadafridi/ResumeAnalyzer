import { Clock3 } from "lucide-react";
import { HistoryGuideList } from "./history-guide-list";

export function HistoryGuideCard() {
  return (
    <div className="rounded-[28px] border border-black/10 bg-white/78 p-5 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-stone-950">How to use history</p>
          <p className="mt-1 text-sm text-stone-600">A quick way to compare versions before your next update.</p>
        </div>
        <Clock3 className="h-5 w-5 text-amber-600" />
      </div>
      <HistoryGuideList />
    </div>
  );
}
