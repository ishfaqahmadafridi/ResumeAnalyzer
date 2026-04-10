import { BadgeCheck, Rocket, TrendingUp } from "lucide-react";

export function WorkspaceHeaderStats({ recentCount }: { recentCount: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[420px]">
      <div className="rounded-[24px] border border-white/80 bg-white/78 px-4 py-4 shadow-[0_15px_30px_rgba(39,39,32,0.06)] backdrop-blur">
        <div className="flex items-center gap-2 text-emerald-700">
          <BadgeCheck className="h-4 w-4" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Supported</span>
        </div>
        <p className="mt-3 text-lg font-semibold text-stone-950">PDF, DOCX, TXT</p>
        <p className="mt-1 text-xs leading-5 text-stone-500">Text-based files give the cleanest results.</p>
      </div>
      <div className="rounded-[24px] border border-white/80 bg-white/78 px-4 py-4 shadow-[0_15px_30px_rgba(39,39,32,0.06)] backdrop-blur">
        <div className="flex items-center gap-2 text-sky-700">
          <TrendingUp className="h-4 w-4" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Recent list</span>
        </div>
        <p className="mt-3 text-lg font-semibold text-stone-950">{recentCount}/4 visible</p>
        <p className="mt-1 text-xs leading-5 text-stone-500">Your newest uploads stay ready for quick switching.</p>
      </div>
      <div className="rounded-[24px] border border-white/80 bg-white/78 px-4 py-4 shadow-[0_15px_30px_rgba(39,39,32,0.06)] backdrop-blur">
        <div className="flex items-center gap-2 text-amber-700">
          <Rocket className="h-4 w-4" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Goal</span>
        </div>
        <p className="mt-3 text-lg font-semibold text-stone-950">Role fit + next skills</p>
        <p className="mt-1 text-xs leading-5 text-stone-500">Use the analysis to pick a stronger direction.</p>
      </div>
    </div>
  );
}
