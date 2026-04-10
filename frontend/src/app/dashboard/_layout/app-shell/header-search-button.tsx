import { Search } from "lucide-react";

export function HeaderSearchButton() {
  return (
    <button
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-stone-600 transition hover:bg-stone-50 hover:text-stone-950"
      aria-label="Search"
      title="Search"
    >
      <Search className="h-4 w-4" />
    </button>
  );
}
