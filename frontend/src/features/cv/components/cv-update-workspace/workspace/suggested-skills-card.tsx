export function SuggestedSkillsCard({ suggestedSkills }: { suggestedSkills: string[] }) {
  if (!suggestedSkills.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-3">
      <p className="text-sm font-semibold text-stone-900">Suggested New Skills</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {suggestedSkills.map((item) => (
          <span key={item} className="rounded-full border border-stone-300 bg-stone-50 px-3 py-1 text-xs text-stone-700">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
