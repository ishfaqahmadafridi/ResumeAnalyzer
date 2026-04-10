import { Plus } from "lucide-react";

interface Props {
  customPlatformName: string;
  setCustomPlatformName: (name: string) => void;
  addCustomPlatform: () => void;
}

export function JobsPlatformAdd({ customPlatformName, setCustomPlatformName, addCustomPlatform }: Props) {
  return (
    <div className="rounded-[24px] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,245,240,0.92))] p-4">
      <p className="text-sm font-semibold text-stone-900">Add another platform</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          value={customPlatformName}
          onChange={(event) => setCustomPlatformName(event.target.value)}
          placeholder="Type a platform name"
          className="min-w-0 flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-stone-400"
        />
        <button
          onClick={addCustomPlatform}
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-stone-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
        >
          <Plus className="h-4 w-4" />
          Add platform
        </button>
      </div>
    </div>
  );
}
