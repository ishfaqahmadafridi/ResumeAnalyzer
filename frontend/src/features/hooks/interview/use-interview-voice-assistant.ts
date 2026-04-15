import { useCallback } from "react";
import { useInterviewVoiceStore } from "@/features/interview/store/interview-voice-store";
import type { VoiceFailureReason } from "@/features/types/interview/voice";
import { captureSpeechOnce, supportsSpeechRecognition } from "@/features/utils/interview/speech-recognition";
import { speakAssistantText } from "@/features/utils/interview/speech-synthesis";

interface UseInterviewVoiceAssistantArgs {
  sendMessage: (inputText?: string) => Promise<string | null>;
  setInterviewDraft: (text: string) => void;
  pushAssistantMessage: (text: string) => void;
}

function failureMessageFor(reason?: VoiceFailureReason): string {
  if (reason === "permission-denied") {
    return "Microphone permission is blocked. Please allow microphone access in your browser settings.";
  }
  if (reason === "audio-capture") {
    return "I cannot access your microphone device. Please check your microphone connection.";
  }
  if (reason === "network") {
    return "Speech recognition needs a stable internet connection. Please check your network and try again.";
  }
  if (reason === "not-supported") {
    return "Your browser does not support voice recognition. Please use a supported browser like Chrome.";
  }
  return "I cannot hear you. Please check your microphone and permissions.";
}

export function useInterviewVoiceAssistant({
  sendMessage,
  setInterviewDraft,
  pushAssistantMessage,
}: UseInterviewVoiceAssistantArgs) {
  const phase = useInterviewVoiceStore((state) => state.phase);
  const micVerified = useInterviewVoiceStore((state) => state.micVerified);
  const setPhase = useInterviewVoiceStore((state) => state.setPhase);
  const setMicVerified = useInterviewVoiceStore((state) => state.setMicVerified);

  const startVoiceFlow = useCallback(async () => {
    if (phase === "listening" || phase === "checking") {
      return;
    }

    if (!supportsSpeechRecognition()) {
      const text = failureMessageFor("not-supported");
      pushAssistantMessage(text);
      speakAssistantText(text);
      return;
    }

    const firstCheck = !micVerified;
    setPhase(firstCheck ? "checking" : "listening");
    const capture = await captureSpeechOnce("en-US", firstCheck ? 12000 : 9000);

    if (!capture.transcript) {
      const text = failureMessageFor(capture.reason);
      pushAssistantMessage(text);
      speakAssistantText(text);
      setPhase(firstCheck ? "idle" : "ready");
      return;
    }

    if (firstCheck) {
      setMicVerified(true);
    }

    if (capture.confidence > 0 && capture.confidence < 0.45) {
      const unclearMessage = `I heard: "${capture.transcript}". Please confirm or repeat your sentence clearly.`;
      pushAssistantMessage(unclearMessage);
      speakAssistantText(unclearMessage);
      setInterviewDraft(capture.transcript);
      setPhase("ready");
      return;
    }

    setInterviewDraft(capture.transcript);
    const reply = await sendMessage(capture.transcript);
    if (reply) {
      speakAssistantText(reply);
    }
    setPhase("ready");
  }, [
    micVerified,
    phase,
    pushAssistantMessage,
    sendMessage,
    setInterviewDraft,
    setMicVerified,
    setPhase,
  ]);

  return {
    isListening: phase === "listening" || phase === "checking",
    micVerified,
    startVoiceFlow,
  };
}
