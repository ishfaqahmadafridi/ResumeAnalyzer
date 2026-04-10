import { FileText } from "lucide-react";

export function WorkspaceRecentHeader() {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-lg font-semibold text-stone-950">Saved CV versions</p>
        <p className="mt-1 text-sm text-stone-500">Your latest uploads stay here for quick switching.</p>
      </div>
      <div className="rounded-[20px] bg-stone-100 p-3 text-stone-700">
        <FileText className="h-5 w-5" />
      </div>
    </div>
  );
}
