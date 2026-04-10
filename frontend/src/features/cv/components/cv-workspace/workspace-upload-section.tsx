import { Upload } from "lucide-react";
import { WorkspaceUploadDropzone } from "./workspace-upload-dropzone";
import { WorkspaceUploadIssue } from "./workspace-upload-issue";
import { WorkspaceUploadButton } from "./workspace-upload-button";
import type { UseCVWorkspaceResult } from "@/features/types/cv/workspace";

export function WorkspaceUploadSection({ selectedFile, uploadIssue, isPending, setSelectedFile, setUploadIssue, uploadCV }: UseCVWorkspaceResult) {
  return (
    <div className="rounded-[26px] border border-emerald-900/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(242,249,244,0.94))] p-4 shadow-[0_18px_40px_rgba(56,56,40,0.08)] sm:p-5">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">New CV upload</p>
      <div className="flex items-start gap-3">
        <div className="rounded-[18px] bg-[linear-gradient(135deg,#10b981,#0f766e)] p-2.5 text-white shadow-[0_12px_24px_rgba(16,185,129,0.2)]">
          <Upload className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-base font-semibold text-stone-950 sm:text-lg">Create a new CV version</p>
          <p className="mt-1 text-sm leading-5 text-stone-600">Use a text-based PDF, DOCX, or TXT file. Scanned PDFs are not supported yet.</p>
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
