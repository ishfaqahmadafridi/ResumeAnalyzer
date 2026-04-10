import { EyeOff } from "lucide-react";
import type { PlatformEntry } from "@/features/types/jobs/workspace";

interface Props {
  platform: PlatformEntry;
  updatePlatform: (id: string, updates: Partial<PlatformEntry>) => void;
  hidePlatform: (id: string) => void;
}

export function JobsPlatformItem({ platform, updatePlatform, hidePlatform }: Props) {
  return (
    <div className="rounded-2xl border border-black/10 bg-stone-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <span className="text-sm font-semibold text-stone-900">{platform.label}</span>
          <input
            type="checkbox"
            checked={platform.enabled}
            onChange={(event) => updatePlatform(platform.id, { enabled: event.target.checked })}
            className="cursor-pointer"
          />
        </label>
        <button
          type="button"
          onClick={() => hidePlatform(platform.id)}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:text-stone-950 hover:bg-stone-50"
        >
          <EyeOff className="h-3.5 w-3.5" />
          Hide
        </button>
      </div>
      <input
        value={platform.link}
        onChange={(event) => updatePlatform(platform.id, { link: event.target.value })}
        placeholder={`Paste your ${platform.label} profile URL or username`}
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-stone-400"
      />
    </div>
  );
}
