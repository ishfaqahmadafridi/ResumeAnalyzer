export function WorkspaceStructuredSkills({ detectedSkills }: { detectedSkills: string[] }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-stone-900">Skills</p>
      {detectedSkills.length ? (
        <div className="flex flex-wrap gap-2">
          {detectedSkills.map((skill) => (
            <span key={skill} className="rounded-full border border-black/10 bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-stone-500">
          No reliable skills were detected from this CV yet. You can still type your own target role above and analyze it manually.
        </p>
      )}
    </div>
  );
}
