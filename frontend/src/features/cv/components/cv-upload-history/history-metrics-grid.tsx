import { MetricTotalUploads } from "./metric-total-uploads";
import { MetricVerified } from "./metric-verified";

interface Props {
  totalUploads: number;
  verifiedUploads: number;
}

export function HistoryMetricsGrid({ totalUploads, verifiedUploads }: Props) {
  return (
    <div className="mt-7 grid gap-4 sm:grid-cols-2">
      <MetricTotalUploads count={totalUploads} />
      <MetricVerified count={verifiedUploads} />
    </div>
  );
}
