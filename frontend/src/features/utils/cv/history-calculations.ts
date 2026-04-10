import type { CVHistoryItemType } from "@/features/types/cv/history";

export function filterRecentCVs(cvs: CVHistoryItemType[]): CVHistoryItemType[] {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  return cvs.filter((cv) => {
    const createdAt = new Date(cv.created_at);
    return !Number.isNaN(createdAt.getTime()) && createdAt >= sevenDaysAgo;
  });
}

export function extractSkillsCount(fullJsonState?: string): number {
  if (!fullJsonState) return 0;
  const match = fullJsonState.match(/"skills":\[(.*?)\]/);
  const innerContent = match?.[1] ?? "";
  const quoteCount = innerContent.match(/"/g)?.length ?? 0;
  return parseInt(String(Math.floor(quoteCount / 2)), 10) || 0;
}
