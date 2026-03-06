export function normalizeKeyword(keyword: string): string {
  return keyword.trim().toLowerCase();
}

export function isKeywordDuplicate(existingKeywords: string[], incoming: string): boolean {
  const normalized = normalizeKeyword(incoming);
  return existingKeywords.some((k) => normalizeKeyword(k) === normalized);
}
