import { formatCvCreatedAt } from "@/features/utils/cv/workspace-calculations";

interface Props {
  cv: any;
  index: number;
  isActive: boolean;
  onSelectCv: (id: string) => void;
}

export function WorkspaceRecentItem({ cv, index, isActive, onSelectCv }: Props) {
  return (
    <button
      onClick={() => onSelectCv(cv.id)}
      className={`relative w-full overflow-hidden rounded-[24px] border px-4 py-4 text-left transition ${
        isActive
          ? "border-emerald-500 bg-[linear-gradient(135deg,rgba(232,250,239,1),rgba(240,255,246,0.96))] shadow-[0_14px_28px_rgba(20,83,45,0.12)]"
          : "border-black/8 bg-white/92 hover:border-sky-200 hover:bg-stone-50 hover:shadow-[0_12px_26px_rgba(31,31,28,0.06)]"
      }`}
    >
      <div className="absolute inset-y-0 left-0 w-1 rounded-full bg-[linear-gradient(180deg,#60a5fa,#10b981)] opacity-75" />
      <div className="flex items-center justify-between gap-3 pl-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-100 text-xs font-semibold text-stone-600">
            0{index + 1}
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-900">{formatCvCreatedAt(cv.created_at)}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-stone-400">Saved version</p>
          </div>
        </div>
        {isActive ? (
          <span className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
            Active
          </span>
        ) : null}
      </div>
      <p className="mt-3 line-clamp-2 pl-2 text-xs leading-5 text-stone-600">
        {cv.raw_text?.slice(0, 150) || "No extracted text preview"}
      </p>
    </button>
  );
}
