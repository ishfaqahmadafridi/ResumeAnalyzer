import { FileText } from "lucide-react";

export function WorkspaceRecentHeader() {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-base font-semibold text-stone-950 sm:text-lg">Saved CV versions</p>
        <p className="mt-1 text-xs text-stone-500 sm:text-sm">Showing your current upload here.</p>
      </div>
      <div className="rounded-2xl bg-stone-100 p-2.5 text-stone-700">
        <FileText className="h-4.5 w-4.5" />
      </div>
    </div>
  );
}
