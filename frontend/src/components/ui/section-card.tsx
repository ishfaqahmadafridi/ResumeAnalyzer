import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[28px] border border-black/10 bg-white/82 p-6 shadow-[var(--shadow)]", className)}>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-stone-950">{title}</h2>
        {description ? <p className="mt-1 text-sm text-stone-600">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
