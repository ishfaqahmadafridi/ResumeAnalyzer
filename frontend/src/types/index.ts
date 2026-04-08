export type UserProfile = {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile?: {
    applications_today: number;
    last_application_date: string | null;
  };
};

export type AuthResponse = {
  token: string;
  user: UserProfile;
};

export type RecommendedRole = {
  id: string;
  title: string;
  match_percentage: number;
  created_at: string;
};

export type AnalysisSummary = {
  id: string;
  full_json_state: string;
  score: number;
  created_at: string;
};

export type VerificationSummary = {
  id: string;
  is_verified: boolean;
  details: string;
  created_at: string;
};

export type CVRecord = {
  id: string;
  encrypted_file: string;
  raw_text: string;
  created_at: string;
  updated_at: string;
  recommended_roles: RecommendedRole[];
  latest_analysis: AnalysisSummary | null;
  latest_verification: VerificationSummary | null;
};

export type CVStructuredData = {
  name?: string;
  email?: string;
  phone?: string;
  summary?: string;
  experience?: string[];
  education?: string[];
  projects?: string[];
  skills?: string[];
  links?: string[];
};

export type CVRoleAnalysis = {
  structured_data: CVStructuredData;
  recommended_roles: Array<{
    role: string;
    matched_skills: string[];
    missing_skills: string[];
    matched_skills_percentage: number;
  }>;
  analysis: {
    role: string;
    your_skills: string[];
    matched_skills: string[];
    matched_skills_percentage: number;
    missing_skills: string[];
    recommended_skills: string[];
    role_specific_cv_score: number;
  } | null;
  score: number;
};

export type AgentWorkflowResult = {
  thread_id: string;
  profile_summary?: {
    recommended_roles?: Array<{
      role: string;
      matched_skills_percentage: number;
      matched_skills: string[];
      missing_skills: string[];
    }>;
    score?: number;
    analysis?: CVRoleAnalysis["analysis"];
  };
  jobs?: Array<{
    title: string;
    company: string;
    location: string;
    url: string;
    source: string;
  }>;
  applications?: Array<{
    job_title: string;
    status: string;
    cover_note: string;
  }>;
  notifications?: string[];
};
