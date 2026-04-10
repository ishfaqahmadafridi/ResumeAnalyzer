import { extractSkillsCount } from "@/features/utils/cv/history-calculations";

interface Props {
  isVerified?: boolean;
  fullJsonState?: string;
}

export function TimelineCardStats({ isVerified, fullJsonState }: Props) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl bg-stone-50 px-3 py-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Verification</p>
        <p className="mt-2 text-sm font-semibold text-stone-900">
          {isVerified ? "Verified" : "Pending"}
        </p>
      </div>
      <div className="rounded-2xl bg-stone-50 px-3 py-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Detected skills</p>
        <p className="mt-2 text-sm font-semibold text-stone-900">
          {extractSkillsCount(fullJsonState)}
        </p>
      </div>
    </div>
  );
}
