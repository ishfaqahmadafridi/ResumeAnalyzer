import { HeaderTitle } from "@/app/dashboard/_layout/app-shell/header-title";
import { HeaderActions } from "@/app/dashboard/_layout/app-shell/header-actions";

export function Header() {
  return (
    <header className="mb-6 flex flex-col gap-4 rounded-[28px] border border-black/10 bg-white/84 px-5 py-4 shadow-[var(--shadow)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
      <HeaderTitle />
      <HeaderActions />
    </header>
  );
}
