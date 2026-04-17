import { Sparkles } from "lucide-react";

export function ImprovementsCard({ improvements }: { improvements: string[] }) {
  if (!improvements.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
      <div className="mb-2 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-emerald-700" />
        <p className="text-sm font-semibold text-emerald-900">Improvements</p>
      </div>
      <ul className="list-disc pl-5 text-sm text-emerald-800">
        {improvements.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
