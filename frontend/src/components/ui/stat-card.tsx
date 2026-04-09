import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  detail,
  tone = "default",
}: {
  title: string;
  value: string;
  detail: string;
  tone?: "default" | "accent" | "success";
}) {
  return (
    <div
      className={cn(
        "rounded-[26px] border p-5 shadow-[var(--shadow)] backdrop-blur-xl",
        tone === "default" && "border-black/10 bg-white/80",
        tone === "accent" && "border-amber-500/30 bg-amber-100/80",
        tone === "success" && "border-emerald-500/25 bg-emerald-50/90",
      )}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{title}</p>
      <p className="mt-3 text-4xl font-semibold text-stone-950">{value}</p>
      <p className="mt-2 text-sm text-stone-600">{detail}</p>
    </div>
  );
}
