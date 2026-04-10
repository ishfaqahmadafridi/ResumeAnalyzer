import { WorkspaceRecentItem } from "./workspace-recent-item";

interface Props {
  recentCvs: any[];
  selectedCv: any | null;
  onSelectCv: (id: string) => void;
}

export function WorkspaceRecentList({ recentCvs, selectedCv, onSelectCv }: Props) {
  return (
    <div className="mt-5 space-y-3">
      {recentCvs.length ? (
        recentCvs.map((cv, index) => (
          <WorkspaceRecentItem
            key={cv.id}
            cv={cv}
            index={index}
            isActive={selectedCv?.id === cv.id}
            onSelectCv={onSelectCv}
          />
        ))
      ) : (
        <div className="rounded-[24px] border border-dashed border-black/10 bg-stone-50/80 px-4 py-8 text-center text-sm text-stone-500">
          No uploaded CVs yet. Your recent versions will appear here after the first upload.
        </div>
      )}
    </div>
  );
}
