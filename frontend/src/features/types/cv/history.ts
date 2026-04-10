export interface CVHistoryItemType {
  id: string;
  created_at: string;
  raw_text?: string;
  latest_analysis?: {
    score?: number;
    full_json_state: string;
  };
  latest_verification?: {
    is_verified?: boolean;
    details?: string;
  };
}

export interface UseCVHistoryResult {
  recentCvs: CVHistoryItemType[];
  totalUploads: number;
  verifiedUploads: number;
  selectedCvId: string | null;
  isPending: boolean;
  onSelectCv: (id: string) => void;
}
