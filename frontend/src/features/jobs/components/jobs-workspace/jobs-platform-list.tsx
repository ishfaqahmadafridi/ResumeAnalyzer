import { JobsPlatformItem } from "./jobs-platform-item";
import type { PlatformEntry } from "@/features/types/jobs/workspace";

interface Props {
  visiblePlatforms: PlatformEntry[];
  updatePlatform: (id: string, updates: Partial<PlatformEntry>) => void;
  hidePlatform: (id: string) => void;
}

export function JobsPlatformList({ visiblePlatforms, updatePlatform, hidePlatform }: Props) {
  return (
    <div className="space-y-4">
      {visiblePlatforms.map((platform) => (
        <JobsPlatformItem 
          key={platform.id} 
          platform={platform} 
          updatePlatform={updatePlatform} 
          hidePlatform={hidePlatform} 
        />
      ))}
    </div>
  );
}
