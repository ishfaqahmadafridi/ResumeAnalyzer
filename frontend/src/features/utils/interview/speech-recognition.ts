import type { VoiceCaptureResult, VoiceFailureReason } from "@/features/types/interview/voice";

type BrowserSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type BrowserSpeechRecognitionCtor = new () => BrowserSpeechRecognition;

type SpeechRecognitionEvent = {
  results: ArrayLike<{
    isFinal: boolean;
    0: {
      transcript: string;
      confidence: number;
    };
  }>;
};

type SpeechRecognitionErrorEvent = {
  error: string;
};

function getRecognitionCtor(): BrowserSpeechRecognitionCtor | null {
  if (typeof window === "undefined") {
    return null;
  }

  const win = window as Window & {
    webkitSpeechRecognition?: BrowserSpeechRecognitionCtor;
    SpeechRecognition?: BrowserSpeechRecognitionCtor;
  };

  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null;
}

function mapErrorReason(error: string): VoiceFailureReason {
  if (error === "not-allowed" || error === "service-not-allowed") {
    return "permission-denied";
  }
  if (error === "audio-capture") {
    return "audio-capture";
  }
  if (error === "network") {
    return "network";
  }
  if (error === "aborted") {
    return "aborted";
  }
  return "unknown";
}

export function supportsSpeechRecognition(): boolean {
  return Boolean(getRecognitionCtor());
}

export function captureSpeechOnce(language = "en-US", timeoutMs = 9000): Promise<VoiceCaptureResult> {
  const RecognitionCtor = getRecognitionCtor();
  if (!RecognitionCtor) {
    return Promise.resolve({ transcript: "", confidence: 0, reason: "not-supported" });
  }

  return new Promise((resolve) => {
    const recognition = new RecognitionCtor();
    let resolved = false;

    const resolveOnce = (value: VoiceCaptureResult) => {
      if (resolved) {
        return;
      }
      resolved = true;
      clearTimeout(timeoutId);
      resolve(value);
    };

    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const firstResult = event.results?.[0];
      const best = firstResult?.[0];
      const transcript = (best?.transcript ?? "").trim();
      const confidence = Number(best?.confidence ?? 0);

      if (!transcript) {
        resolveOnce({ transcript: "", confidence: 0, reason: "no-input" });
        recognition.stop();
        return;
      }

      resolveOnce({ transcript, confidence });
      recognition.stop();
    };

    recognition.onerror = (event) => {
      resolveOnce({ transcript: "", confidence: 0, reason: mapErrorReason(event.error) });
    };

    recognition.onend = () => {
      resolveOnce({ transcript: "", confidence: 0, reason: "no-input" });
    };

    const timeoutId = window.setTimeout(() => {
      try {
        recognition.abort();
      } catch {
        // Ignore abort errors from browser speech API.
      }
      resolveOnce({ transcript: "", confidence: 0, reason: "no-input" });
    }, timeoutMs);

    try {
      recognition.start();
    } catch {
      clearTimeout(timeoutId);
      resolveOnce({ transcript: "", confidence: 0, reason: "unknown" });
    }
  });
}
