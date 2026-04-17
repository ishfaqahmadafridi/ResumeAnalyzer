export type VoicePhase = "idle" | "checking" | "ready" | "listening";

export type VoiceFailureReason =
  | "not-supported"
  | "no-input"
  | "permission-denied"
  | "audio-capture"
  | "network"
  | "aborted"
  | "unknown";

export interface VoiceCaptureResult {
  transcript: string;
  confidence: number;
  reason?: VoiceFailureReason;
}
