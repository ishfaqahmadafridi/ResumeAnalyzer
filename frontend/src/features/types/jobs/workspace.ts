import type { AgentWorkflowResult } from "@/types";

export interface PlatformEntry {
  id: string;
  label: string;
  enabled: boolean;
  link: string;
  hidden?: boolean;
}

export interface UseJobsWorkspaceResult {
  workflow: AgentWorkflowResult | null;
  customPlatformName: string;
  setCustomPlatformName: (name: string) => void;
  isPending: boolean;
  visiblePlatforms: PlatformEntry[];
  hiddenPlatforms: PlatformEntry[];
  addCustomPlatform: () => void;
  updatePlatform: (id: string, updates: Partial<PlatformEntry>) => void;
  hidePlatform: (id: string) => void;
  unhidePlatform: (id: string) => void;
  runWorkflow: () => void;
}
