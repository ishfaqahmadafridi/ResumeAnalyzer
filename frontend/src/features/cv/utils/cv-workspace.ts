import { parseJson } from "@/lib/utils";
import type { CVRoleAnalysis } from "@/types";

export type UploadGuidance = {
  title: string;
  summary: string;
  steps: string[];
  tip: string;
};

export function roleAnalysisFromStored(value: string | null | undefined, score = 0) {
  return parseJson<CVRoleAnalysis | null>(value, null) ?? {
    structured_data: {},
    recommended_roles: [],
    analysis: null,
    score,
  };
}

export function formatCvCreatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function getUploadGuidance(message: string, fileName?: string | null): UploadGuidance {
  const lowerMessage = message.toLowerCase();
  const lowerFileName = (fileName ?? "").toLowerCase();

  if (lowerMessage.includes("could not extract readable text")) {
    return {
      title: "We couldn't read text from that CV",
      summary: "This usually means the file is a scanned PDF or an exported image-based resume.",
      steps: [
        "Open the CV and try Save as Word or export it as a text-based PDF.",
        "If you have the source file, upload the DOCX version instead.",
        "If the CV was scanned from paper, convert it with OCR first, then upload it again.",
      ],
      tip: lowerFileName.endsWith(".pdf")
        ? "This PDF looks image-based, so the extractor cannot read the resume text yet."
        : "Try uploading a DOCX or TXT version for the best results.",
    };
  }

  return {
    title: "Upload failed",
    summary: message,
    steps: [
      "Check that the file is a PDF, DOCX, or TXT document.",
      "Try another copy of the CV if this file may be corrupted.",
    ],
    tip: "If the problem keeps happening, we can add a stronger upload fallback next.",
  };
}
