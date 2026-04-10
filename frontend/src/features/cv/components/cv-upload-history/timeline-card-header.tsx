import { formatCvCreatedAt } from "@/features/utils/cv/workspace-calculations";

interface Props {
  createdAt: string;
  score?: number;
}

export function TimelineCardHeader({ createdAt, score }: Props) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-semibold text-stone-950">{formatCvCreatedAt(createdAt)}</p>
      <span className="rounded-full bg-stone-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-50">
        {score ?? 0}
      </span>
    </div>
  );
}
