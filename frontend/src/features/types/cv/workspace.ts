import type { CVRoleAnalysis } from "@/types";

export interface UploadGuidanceType {
  title: string;
  summary: string;
  steps: string[];
  tip: string;
}

export interface UseCVWorkspaceResult {
  recentCvs: any[];
  selectedCv: any | null;
  selectedRole: string | null;
  latestRoleAnalysis: any | null;
  isPending: boolean;
  selectedFile: File | null;
  uploadIssue: UploadGuidanceType | null;
  customRole: string;
  recommendedRoles: any[];
  analysis: any | null;
  structured: any | null;
  detectedSkills: string[];
  hasDetectedProfileSignals: boolean;
  setCustomRole: (val: string) => void;
  setSelectedFile: (file: File | null) => void;
  setUploadIssue: (issue: UploadGuidanceType | null) => void;
  uploadCV: () => Promise<void>;
  analyzeRole: (role: string) => Promise<void>;
  analyzeCustomRole: () => Promise<void>;
  onSelectCv: (id: string) => void;
}
