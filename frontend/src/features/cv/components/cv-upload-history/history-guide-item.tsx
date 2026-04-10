import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  detail: string;
}

export function HistoryGuideItem({ icon: Icon, title, detail }: Props) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-black/10 bg-stone-50/80 px-4 py-4">
      <div className="rounded-2xl bg-white p-2 shadow-sm">
        <Icon className="h-5 w-5 text-emerald-800" />
      </div>
      <div>
        <p className="text-sm font-semibold text-stone-950">{title}</p>
        <p className="mt-1 text-sm text-stone-600">{detail}</p>
      </div>
    </div>
  );
}
