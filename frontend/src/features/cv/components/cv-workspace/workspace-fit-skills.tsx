interface Props {
  missingSkills: string[];
  recommendedSkills: string[];
}

export function WorkspaceFitSkills({ missingSkills, recommendedSkills }: Props) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div>
        <p className="mb-3 text-sm font-semibold text-stone-900">Missing skills</p>
        <div className="flex flex-wrap gap-2">
          {missingSkills.map((skill) => (
            <span key={skill} className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700">
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm font-semibold text-stone-900">Recommended next skills</p>
        <div className="flex flex-wrap gap-2">
          {recommendedSkills.map((skill) => (
            <span key={skill} className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
