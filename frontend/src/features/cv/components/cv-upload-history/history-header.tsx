import { HistoryHeaderTitle } from "./history-header-title";
import { HistoryMetricsGrid } from "./history-metrics-grid";
import { HistoryGuideCard } from "./history-guide-card";

interface Props {
  totalUploads: number;
  verifiedUploads: number;
}

export function HistoryHeader({ totalUploads, verifiedUploads }: Props) {
  return (
    <section className="overflow-hidden rounded-[34px] border border-black/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(242,248,242,0.9)_48%,rgba(247,239,225,0.86))] shadow-[var(--shadow)]">
      <div className="grid gap-8 px-6 py-7 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <div>
          <HistoryHeaderTitle />
          <HistoryMetricsGrid totalUploads={totalUploads} verifiedUploads={verifiedUploads} />
        </div>
        <HistoryGuideCard />
      </div>
    </section>
  );
}
