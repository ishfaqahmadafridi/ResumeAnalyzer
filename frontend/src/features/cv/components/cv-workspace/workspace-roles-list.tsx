import type { UseCVWorkspaceResult } from "@/features/types/cv/workspace";

export function WorkspaceRolesList({ recommendedRoles, selectedRole, analysis, analyzeRole }: UseCVWorkspaceResult) {
  return (
    <>
      {recommendedRoles.map((role) => (
        <button
          key={role.role}
          onClick={() => void analyzeRole(role.role)}
          className={`w-full rounded-2xl border px-4 py-4 text-left ${
            selectedRole === role.role || analysis?.role === role.role
              ? "border-emerald-700 bg-emerald-50"
              : "border-black/10 bg-stone-50"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-stone-900">{role.role}</span>
            <span className="rounded-full bg-stone-950 px-3 py-1 text-xs font-semibold text-stone-50">
              {role.matched_skills_percentage}%
            </span>
          </div>
          <p className="mt-2 text-xs text-stone-600">
            Matched skills: {role.matched_skills.slice(0, 4).join(", ") || "Not enough data yet"}
          </p>
        </button>
      ))}
    </>
  );
}
