import type { UseCVWorkspaceResult } from "@/features/types/cv/workspace";

export function WorkspaceRolesCustomInput({ customRole, setCustomRole, analyzeCustomRole, selectedCv, isPending }: UseCVWorkspaceResult) {
  return (
    <div className="rounded-2xl border border-black/10 bg-stone-50 p-4">
      <p className="text-sm font-semibold text-stone-900">Choose or enter a role</p>
      <p className="mt-1 text-sm text-stone-600">
        If no suggested role appears, type the role you want and run the analysis yourself.
      </p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          value={customRole}
          onChange={(event) => setCustomRole(event.target.value)}
          placeholder="Example: Mechanical Engineer"
          className="min-w-0 flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-stone-900 outline-none"
        />
        <button
          onClick={() => void analyzeCustomRole()}
          disabled={!selectedCv || isPending}
          className="rounded-2xl bg-stone-950 px-4 py-3 text-sm font-semibold text-stone-50 disabled:opacity-60"
        >
          Analyze this role
        </button>
      </div>
    </div>
  );
}
