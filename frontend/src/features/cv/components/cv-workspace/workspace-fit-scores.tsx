interface Props {
  roleScore: number;
  matchedPercentage: number;
}

export function WorkspaceFitScores({ roleScore, matchedPercentage }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl bg-stone-50 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Role score</p>
        <p className="mt-2 text-4xl font-semibold text-stone-950">{roleScore}</p>
      </div>
      <div className="rounded-2xl bg-stone-50 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Matched skills</p>
        <p className="mt-2 text-4xl font-semibold text-stone-950">{matchedPercentage}%</p>
      </div>
    </div>
  );
}
