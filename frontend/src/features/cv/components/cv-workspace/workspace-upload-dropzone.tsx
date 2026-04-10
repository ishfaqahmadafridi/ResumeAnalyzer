import { FileText } from "lucide-react";
import type { UploadGuidanceType } from "@/features/types/cv/workspace";

interface Props {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  setUploadIssue: (issue: UploadGuidanceType | null) => void;
}

export function WorkspaceUploadDropzone({ selectedFile, setSelectedFile, setUploadIssue }: Props) {
  return (
    <label className="mt-3.5 block cursor-pointer rounded-[22px] border border-dashed border-sky-300 bg-[linear-gradient(180deg,rgba(245,250,255,0.95),rgba(255,255,255,0.92))] px-4 py-4 shadow-[0_12px_26px_rgba(59,130,246,0.08)] transition hover:border-sky-400 hover:shadow-[0_14px_30px_rgba(59,130,246,0.12)]">
      <input
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={(event) => {
          setSelectedFile(event.target.files?.[0] ?? null);
          setUploadIssue(null);
        }}
        className="hidden"
      />
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex min-w-0 flex-col items-center gap-2.5">
          <div className="rounded-xl bg-sky-100 p-2.5 text-sky-700">
            <FileText className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-stone-900">{selectedFile ? selectedFile.name : "Choose your CV file"}</p>
          </div>
        </div>
        <span className="inline-flex min-w-[122px] items-center justify-center rounded-full bg-stone-950 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
          Browse file
        </span>
      </div>
    </label>
  );
}
