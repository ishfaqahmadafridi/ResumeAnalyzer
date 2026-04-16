export function sectionTitle(value: string, index: number): string {
  return value.trim() || `Untitled Section ${index + 1}`;
}
