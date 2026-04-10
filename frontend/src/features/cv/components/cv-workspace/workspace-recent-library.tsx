import Link from "next/link";
import { WorkspaceRecentHeader } from "./workspace-recent-header";
import { WorkspaceRecentList } from "./workspace-recent-list";
import type { UseCVWorkspaceResult } from "@/features/types/cv/workspace";
import { useAppSelector } from "@/store";

export function WorkspaceRecentLibrary({ recentCvs, selectedCv, onSelectCv }: UseCVWorkspaceResult) {
  const allCvsLength = useAppSelector((state: any) => state.cv.items.length);
  const currentCvOnly = selectedCv ? [selectedCv] : recentCvs.slice(0, 1);

  return (
    <div className="rounded-[26px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(250,248,243,0.92))] p-4 shadow-[0_18px_36px_rgba(56,56,40,0.06)] sm:p-5">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700">Recent CV library</p>
      <WorkspaceRecentHeader />
      <WorkspaceRecentList recentCvs={currentCvOnly} selectedCv={selectedCv} onSelectCv={onSelectCv} />
      
      {allCvsLength > 1 ? (
        <div className="mt-3 rounded-[18px] bg-stone-50 px-3.5 py-2.5 text-xs leading-5 text-stone-600">
          {allCvsLength - 1} older CV version(s) moved to{" "}
          <Link href="/dashboard/cv-history" className="font-semibold text-sky-700 underline-offset-2 hover:underline">
            CV History
          </Link>
          .
        </div>
      ) : null}
    </div>
  );
}
