import { FileText } from "lucide-react";
import type { CVEditorData } from "@/features/cv/types/update";

export function IdentityEditorCard({
  baseline,
  data,
  updateName,
}: {
  baseline: CVEditorData;
  data: CVEditorData;
  updateName: (value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-stone-200 bg-stone-50 px-4 py-3">
        <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
          <FileText className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-900">Identity</p>
          <p className="text-xs text-stone-500">Update the primary name used in the CV preview.</p>
        </div>
      </div>
      <div className="grid gap-3 p-4">
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Previous Name</p>
          <p className="mt-1 text-sm text-stone-800">{baseline.name || "No name found"}</p>
        </div>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-stone-900">Name</span>
          <input
            value={data.name}
            onChange={(event) => updateName(event.target.value)}
            placeholder="Enter full name"
            className="rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>
      </div>
    </div>
  );
}
