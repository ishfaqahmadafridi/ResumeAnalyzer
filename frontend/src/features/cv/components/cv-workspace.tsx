"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { parseJson } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectCv, selectRole, setCVs, setRoleAnalysis, upsertCV } from "@/store/cv-slice";
import type { CVRoleAnalysis } from "@/types";
import { SectionCard } from "@/components/section-card";
import { CVAnalysisResultsStrengths } from "./CVAnalysisResults/CVAnalysisResultsStrengths";

function roleAnalysisFromStored(value: string | null | undefined, score = 0) {
  return parseJson<CVRoleAnalysis | null>(value, null) ?? {
    structured_data: {},
    recommended_roles: [],
    analysis: null,
    score,
  };
}

export function CVWorkspace() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const cvs = useAppSelector((state) => state.cv.items);
  const selectedCvId = useAppSelector((state) => state.cv.selectedCvId);
  const selectedRole = useAppSelector((state) => state.cv.selectedRole);
  const latestRoleAnalysis = useAppSelector((state) => state.cv.latestRoleAnalysis);
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const selectedCv = useMemo(
    () => cvs.find((item) => item.id === selectedCvId) ?? cvs[0] ?? null,
    [cvs, selectedCvId],
  );

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
  }, [dispatch, selectedCv]);

  async function uploadCV() {
    if (!token || !selectedFile) return;
    try {
      const uploaded = await api.uploadCV(token, selectedFile);
      dispatch(upsertCV(uploaded));
      toast.success("CV uploaded and analyzed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    }
  }

  async function analyzeRole(role: string) {
    if (!token || !selectedCv) return;
    dispatch(selectRole(role));
    try {
      const result = await api.analyzeRole(token, selectedCv.id, role);
      dispatch(setRoleAnalysis(result));
      toast.success(`Re-analyzed for ${role}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Role analysis failed");
    }
  }

  const recommendedRoles = latestRoleAnalysis?.recommended_roles ?? [];
  const analysis = latestRoleAnalysis?.analysis;
  const structured = latestRoleAnalysis?.structured_data;

  return (
    <div className="space-y-6">
      <SectionCard title="CV Analysis Workspace" description="Upload your latest resume, inspect role fit, and see the strongest next improvements.">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-dashed border-black/10 bg-stone-50/70 p-5">
            <p className="text-sm font-semibold text-stone-900">Upload a fresh CV</p>
            <p className="mt-1 text-sm text-stone-600">PDF works best with the current backend extractor.</p>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
              className="mt-4 block w-full rounded-2xl border border-black/10 bg-white px-4 py-3"
            />
            <button
              onClick={() => void uploadCV()}
              disabled={!selectedFile || isPending}
              className="mt-4 rounded-2xl bg-emerald-900 px-4 py-3 text-sm font-semibold text-emerald-50 disabled:opacity-60"
            >
              {isPending ? "Working..." : "Upload and analyze"}
            </button>
          </div>
          <div className="rounded-[24px] border border-black/10 bg-white p-5">
            <p className="text-sm font-semibold text-stone-900">Saved CV versions</p>
            <div className="mt-4 space-y-3">
              {cvs.length ? (
                cvs.map((cv) => (
                  <button
                    key={cv.id}
                    onClick={() => dispatch(selectCv(cv.id))}
                    className={`w-full rounded-2xl border px-4 py-3 text-left ${
                      selectedCv?.id === cv.id ? "border-emerald-700 bg-emerald-50" : "border-black/10 bg-stone-50"
                    }`}
                  >
                    <p className="text-sm font-semibold text-stone-900">{new Date(cv.created_at).toLocaleDateString()}</p>
                    <p className="mt-1 text-xs text-stone-600">{cv.raw_text?.slice(0, 120) || "No extracted text preview"}</p>
                  </button>
                ))
              ) : (
                <p className="text-sm text-stone-500">No uploaded CVs yet.</p>
              )}
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Recommended Roles" description="Choose the primary role you want this CV optimized for.">
          <div className="space-y-3">
            {recommendedRoles.length ? (
              recommendedRoles.map((role) => (
                <button
                  key={role.role}
                  onClick={() => void analyzeRole(role.role)}
                  className={`w-full rounded-2xl border px-4 py-4 text-left ${
                    selectedRole === role.role || analysis?.role === role.role
                      ? "border-emerald-700 bg-emerald-50"
                      : "border-black/10 bg-stone-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-stone-900">{role.role}</span>
                    <span className="rounded-full bg-stone-950 px-3 py-1 text-xs font-semibold text-stone-50">
                      {role.matched_skills_percentage}%
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-stone-600">
                    Matched skills: {role.matched_skills.slice(0, 4).join(", ") || "Not enough data yet"}
                  </p>
                </button>
              ))
            ) : (
              <p className="text-sm text-stone-500">Upload a CV to generate role suggestions.</p>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Role Fit Breakdown" description="Your extracted profile, matched skills, and the most useful next skills to add.">
          {analysis ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-stone-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Role score</p>
                  <p className="mt-2 text-4xl font-semibold text-stone-950">{analysis.role_specific_cv_score}</p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Matched skills</p>
                  <p className="mt-2 text-4xl font-semibold text-stone-950">{analysis.matched_skills_percentage}%</p>
                </div>
              </div>
              <CVAnalysisResultsStrengths strengths={analysis.matched_skills} roleName={analysis.role} cvSkills={analysis.your_skills} />
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="mb-3 text-sm font-semibold text-stone-900">Missing skills</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missing_skills.map((skill) => (
                      <span key={skill} className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-sm font-semibold text-stone-900">Recommended next skills</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.recommended_skills.map((skill) => (
                      <span key={skill} className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-stone-500">Role analysis will appear here after you upload a CV and choose a role.</p>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Structured CV Preview" description="Parsed candidate details from the current CV.">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm"><span className="font-semibold">Name:</span> {structured?.name || "Unknown"}</p>
            <p className="text-sm"><span className="font-semibold">Email:</span> {structured?.email || "Unknown"}</p>
            <p className="text-sm"><span className="font-semibold">Phone:</span> {structured?.phone || "Unknown"}</p>
            <p className="text-sm"><span className="font-semibold">Summary:</span> {structured?.summary || "No summary extracted"}</p>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-stone-900">Skills</p>
            <div className="flex flex-wrap gap-2">
              {(structured?.skills ?? []).map((skill) => (
                <span key={skill} className="rounded-full border border-black/10 bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
