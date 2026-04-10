import type { PlatformEntry } from "@/features/types/jobs/workspace";

interface Props {
  hiddenPlatforms: PlatformEntry[];
  unhidePlatform: (id: string) => void;
}

export function JobsHiddenPlatforms({ hiddenPlatforms, unhidePlatform }: Props) {
  if (hiddenPlatforms.length === 0) return null;

  return (
    <div className="rounded-[24px] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,244,241,0.92))] p-4 shadow-sm">
      <p className="text-sm font-semibold text-stone-900">Hidden platforms</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {hiddenPlatforms.map((platform) => (
          <button
            key={platform.id}
            type="button"
            onClick={() => unhidePlatform(platform.id)}
            className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-50 hover:text-stone-950"
          >
            Unhide {platform.label}
          </button>
        ))}
      </div>
    </div>
  );
}
