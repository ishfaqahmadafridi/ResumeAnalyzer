import { Upload } from "lucide-react";
import { WorkspaceUploadDropzone } from "./workspace-upload-dropzone";
import { WorkspaceUploadIssue } from "./workspace-upload-issue";
import { WorkspaceUploadButton } from "./workspace-upload-button";
import type { UseCVWorkspaceResult } from "@/features/types/cv/workspace";

export function WorkspaceUploadSection({ selectedFile, uploadIssue, isPending, setSelectedFile, setUploadIssue, uploadCV }: UseCVWorkspaceResult) {
  return (
    <div className="rounded-[30px] border border-emerald-900/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(242,249,244,0.94))] p-6 shadow-[0_24px_54px_rgba(56,56,40,0.08)]">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">New CV upload</p>
      <div className="flex items-start gap-4">
        <div className="rounded-[22px] bg-[linear-gradient(135deg,#10b981,#0f766e)] p-3 text-white shadow-[0_14px_30px_rgba(16,185,129,0.24)]">
          <Upload className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-semibold text-stone-950">Create a new CV version</p>
          <p className="mt-1 text-sm leading-6 text-stone-600">Use a text-based PDF, DOCX, or TXT file. Scanned PDFs are not supported yet.</p>
        </div>
      </div>
      <WorkspaceUploadDropzone 
        selectedFile={selectedFile} 
        setSelectedFile={setSelectedFile} 
        setUploadIssue={setUploadIssue} 
      />
      {uploadIssue && <WorkspaceUploadIssue uploadIssue={uploadIssue} />}
      <WorkspaceUploadButton 
        isPending={isPending} 
        selectedFile={selectedFile} 
        uploadCV={uploadCV} 
      />
    </div>
  );
}
