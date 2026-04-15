const NON_LATIN_SCRIPT_RE = /[\p{Script=Arabic}\p{Script=Devanagari}\p{Script=Cyrillic}\p{Script=Han}\p{Script=Thai}\p{Script=Hangul}\p{Script=Hebrew}\p{Script=Bengali}\p{Script=Tamil}\p{Script=Telugu}\p{Script=Gujarati}\p{Script=Gurmukhi}]/u;

export function isLikelyUnsupportedInterviewLanguage(text: string): boolean {
  const normalized = (text || "").trim();
  if (!normalized) {
    return false;
  }

  if (NON_LATIN_SCRIPT_RE.test(normalized)) {
    return true;
  }

  const latinLetters = normalized.match(/[A-Za-z]/g)?.length ?? 0;
  const allLetters = normalized.match(/[\p{L}]/gu)?.length ?? 0;
  if (allLetters < 6) {
    return false;
  }

  const latinRatio = latinLetters / allLetters;
  return latinRatio < 0.5;
}

export function unsupportedLanguageInterviewMessage(): string {
  return "I am sorry, I could not understand that language. Please ask your interview answer in simple English.";
}
