import type { LucideIcon } from "lucide-react";

export function SkillBadgeList({
  skills,
  icon: Icon,
  label,
  emptyMessage,
  variant = "default",
}: {
  skills: string[];
  icon: LucideIcon;
  label: string;
  emptyMessage: string;
  variant?: "default" | "success" | "warning";
}) {
  const tone =
    variant === "success"
      ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
      : variant === "warning"
        ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
        : "bg-stone-900/5 text-stone-700 border-stone-900/10";

  return (
    <div>
      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-900">
        <Icon className="h-4 w-4" />
        {label}
      </h4>
      <div className="flex flex-wrap gap-2">
        {skills.length ? (
          skills.map((skill) => (
            <span key={skill} className={`rounded-full border px-3 py-1 text-xs font-medium ${tone}`}>
              {skill}
            </span>
          ))
        ) : (
          <p className="text-sm text-stone-500">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
}
