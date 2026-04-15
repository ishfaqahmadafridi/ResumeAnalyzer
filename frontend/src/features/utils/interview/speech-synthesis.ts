export function speakAssistantText(text: string): void {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return;
  }

  const phrase = (text || "").trim();
  if (!phrase) {
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Silently ignore browser speech synthesis failures.
  }
}
