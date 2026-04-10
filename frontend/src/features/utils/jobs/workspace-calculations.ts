import type { PlatformEntry } from "@/features/types/jobs/workspace";

export const defaultPlatforms: PlatformEntry[] = [
  { id: "github", label: "GitHub", enabled: true, link: "" },
  { id: "linkedin", label: "LinkedIn", enabled: true, link: "" },
  { id: "indeed", label: "Indeed", enabled: true, link: "" },
  { id: "rozee", label: "Rozee", enabled: false, link: "" },
];

export const PLATFORM_STORAGE_KEY = "cvforge-platform-connections";

export function toPlatformId(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export function getStoredPlatforms(): PlatformEntry[] {
  if (typeof window === "undefined") {
    return defaultPlatforms;
  }
  try {
    const stored = window.localStorage.getItem(PLATFORM_STORAGE_KEY);
    if (!stored) {
      return defaultPlatforms;
    }
    const parsed = JSON.parse(stored) as PlatformEntry[];
    return Array.isArray(parsed) && parsed.length ? parsed : defaultPlatforms;
  } catch {
    return defaultPlatforms;
  }
}

export function storePlatforms(platforms: PlatformEntry[]) {
  try {
    window.localStorage.setItem(PLATFORM_STORAGE_KEY, JSON.stringify(platforms));
  } catch {}
}
