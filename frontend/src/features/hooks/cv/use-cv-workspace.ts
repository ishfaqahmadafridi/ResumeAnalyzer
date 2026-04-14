import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectCv, selectRole, setCVs, setRoleAnalysis, upsertCV } from "@/store/cv-slice";
import { getUploadGuidance, roleAnalysisFromStored } from "@/features/utils/cv/workspace-calculations";
import type { UseCVWorkspaceResult, UploadGuidanceType } from "@/features/types/cv/workspace";

export function useCVWorkspace(): UseCVWorkspaceResult {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state: any) => state.auth.token);
  const cvs = useAppSelector((state: any) => state.cv.items);
  const selectedCvId = useAppSelector((state: any) => state.cv.selectedCvId);
  const selectedRole = useAppSelector((state: any) => state.cv.selectedRole);
  const latestRoleAnalysis = useAppSelector((state: any) => state.cv.latestRoleAnalysis);
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadIssue, setUploadIssue] = useState<UploadGuidanceType | null>(null);
  const [customRole, setCustomRole] = useState("");

  const selectedCv = useMemo(
    () => cvs.find((item: any) => item.id === selectedCvId) ?? cvs[0] ?? null,
    [cvs, selectedCvId],
  );
  const recentCvs = useMemo(() => cvs.slice(0, 4), [cvs]);

  useEffect(() => {
    if (!token) return;
    startTransition(async () => {
      try {
        const records = await api.listCVs(token);
        dispatch(setCVs(records));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load CVs");
      }
    });
  }, [dispatch, token]);

  useEffect(() => {
    if (!selectedCv?.latest_analysis) return;
    const parsed = roleAnalysisFromStored(selectedCv.latest_analysis.full_json_state, selectedCv.latest_analysis.score);
    dispatch(setRoleAnalysis(parsed));
    dispatch(selectRole(parsed?.analysis?.role ?? null));
  }, [dispatch, selectedCv]);

  async function uploadCV() {
    if (!token || !selectedFile) return;
    const startedAt = performance.now();
    try {
      const uploaded = await api.uploadCV(token, selectedFile);
      const elapsedSec = ((performance.now() - startedAt) / 1000).toFixed(1);
      setUploadIssue(null);
      setCustomRole("");
      dispatch(selectRole(null));
      dispatch(upsertCV(uploaded));
      toast.success("CV uploaded", {
        description: `Initial analysis finished in ${elapsedSec}s. Select a role to see Role Fit Breakdown.`,
        duration: 4500,
      });

      if (!uploaded.recommended_roles?.length) {
        toast.warning("No recommended roles detected", {
          description: "AI model may be unavailable (for example expired API key), or the CV needs clearer role keywords. Enter your own role to continue.",
          duration: 6000,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      const guidance = getUploadGuidance(message, selectedFile.name);
      setUploadIssue(guidance);
      toast.error(guidance.title, {
        description: guidance.tip,
      });
    }
  }

  async function analyzeRole(role: string) {
    if (!token || !selectedCv) return;
    dispatch(selectRole(role));
    const startedAt = performance.now();
    try {
      const result = await api.analyzeRole(token, selectedCv.id, role);
      const elapsedSec = ((performance.now() - startedAt) / 1000).toFixed(1);
      dispatch(setRoleAnalysis(result));
      toast.success(`Role analysis ready: ${role}`, {
        description: `Completed in ${elapsedSec}s.`,
        duration: 4000,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Role analysis failed");
    }
  }

  async function analyzeCustomRole() {
    const role = customRole.trim();
    if (!role) {
      toast.error("Enter a role first", {
        description: "Example: Mechanical Engineer, Data Analyst, or QA Engineer.",
      });
      return;
    }
    await analyzeRole(role);
  }

  const onSelectCv = (id: string) => {
    dispatch(selectCv(id));
  };

  const recommendedRoles =
    latestRoleAnalysis?.recommended_roles?.length
      ? latestRoleAnalysis.recommended_roles
      : (selectedCv?.recommended_roles ?? []).map((role: any) => ({
          role: role.title,
          matched_skills: [],
          missing_skills: [],
          matched_skills_percentage: role.match_percentage,
        }));
  const analysis = latestRoleAnalysis?.analysis;
  const structured = latestRoleAnalysis?.structured_data;
  const uiSkillNoiseTerms = [
    "english",
    "urdu",
    "pashto",
    "romanian",
    "spanish",
    "university",
    "college",
    "degree",
    "education",
    "linkedin",
    "github",
    "gmail",
    "rawalpindi",
    "punjab",
    "islamabad",
  ];
  const sanitizeUiSkills = (items: string[] = []) =>
    items.filter((value) => {
      const normalized = String(value || "").toLowerCase().trim();
      if (!normalized) return false;
      if (normalized.includes("http") || normalized.includes("www.") || normalized.includes("@") || normalized.includes(".com")) {
        return false;
      }
      return !uiSkillNoiseTerms.some((term) => normalized.includes(term));
    });

  const detectedSkills = sanitizeUiSkills(analysis?.your_skills?.length ? analysis.your_skills : (structured?.skills ?? []));
  const hasDetectedProfileSignals = Boolean(structured?.summary || structured?.experience?.length || structured?.projects?.length || detectedSkills.length);

  return {
    recentCvs,
    selectedCv,
    selectedRole,
    latestRoleAnalysis,
    isPending,
    selectedFile,
    uploadIssue,
    customRole,
    recommendedRoles,
    analysis,
    structured,
    detectedSkills,
    hasDetectedProfileSignals,
    setCustomRole,
    setSelectedFile,
    setUploadIssue,
    uploadCV,
    analyzeRole,
    analyzeCustomRole,
    onSelectCv,
  };
}
