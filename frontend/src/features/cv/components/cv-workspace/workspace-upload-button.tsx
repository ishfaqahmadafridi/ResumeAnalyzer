import { Rocket } from "lucide-react";

interface Props {
  isPending: boolean;
  selectedFile: File | null;
  uploadCV: () => Promise<void>;
}

export function WorkspaceUploadButton({ isPending, selectedFile, uploadCV }: Props) {
  return (
    <button
      onClick={() => void uploadCV()}
      disabled={!selectedFile || isPending}
      className="mt-3.5 inline-flex items-center justify-center gap-2 rounded-[18px] bg-[linear-gradient(135deg,#4e8df7,#346ee8)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_26px_rgba(52,110,232,0.26)] transition hover:translate-y-[-1px] hover:shadow-[0_18px_32px_rgba(52,110,232,0.32)] disabled:opacity-60"
    >
      {isPending ? "Working..." : "Upload and analyze"}
      <Rocket className="h-4 w-4" />
    </button>
  );
}
