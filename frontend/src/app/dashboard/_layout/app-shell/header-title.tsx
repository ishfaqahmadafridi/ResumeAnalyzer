import { usePathname } from "next/navigation";
import { pageMeta } from "@/utils/constants";

export function HeaderTitle() {
  const pathname = usePathname();
  const currentMeta = pageMeta[pathname] ?? {
    eyebrow: "CV analysis platform",
    title: "Manage your documents, role fit, and application workflow",
  };

  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">{currentMeta.eyebrow}</p>
      <p className="mt-2 text-base font-semibold text-stone-950 sm:text-lg">{currentMeta.title}</p>
    </div>
  );
}
