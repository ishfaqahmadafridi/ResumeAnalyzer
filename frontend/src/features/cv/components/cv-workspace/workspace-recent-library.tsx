import { WorkspaceRecentHeader } from "./workspace-recent-header";
import { WorkspaceRecentList } from "./workspace-recent-list";
import type { UseCVWorkspaceResult } from "@/features/types/cv/workspace";
import { useAppSelector } from "@/store";

export function WorkspaceRecentLibrary({ recentCvs, selectedCv, onSelectCv }: UseCVWorkspaceResult) {
  const allCvsLength = useAppSelector((state: any) => state.cv.items.length);
  return (
    <div className="rounded-[30px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(250,248,243,0.92))] p-6 shadow-[0_22px_45px_rgba(56,56,40,0.06)]">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700">Recent CV library</p>
      <WorkspaceRecentHeader />
      <WorkspaceRecentList recentCvs={recentCvs} selectedCv={selectedCv} onSelectCv={onSelectCv} />
      
      {allCvsLength > 4 ? (
        <div className="mt-4 rounded-[22px] bg-stone-50 px-4 py-3 text-xs leading-5 text-stone-500">
          Showing the latest 4 CV versions here. Older uploads stay available in <span className="font-semibold text-stone-700">CV History</span>.
        </div>
      ) : null}
      <div className="mt-4 rounded-[22px] border border-sky-100 bg-[linear-gradient(180deg,rgba(245,250,255,0.9),rgba(255,255,255,0.94))] px-4 py-3 text-xs leading-5 text-stone-600">
        Quick flow: upload a fresh CV, switch between recent versions here, then continue with the role direction below.
      </div>
    </div>
  );
}
