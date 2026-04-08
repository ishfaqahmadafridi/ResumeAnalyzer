import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "secondary";
}) {
  return <span className={cn("rounded-full border px-3 py-1 text-xs font-medium", className)}>{children}</span>;
}
