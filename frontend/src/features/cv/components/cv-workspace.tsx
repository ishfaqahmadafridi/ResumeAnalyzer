"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectCv, selectRole, setCVs, setRoleAnalysis, upsertCV } from "@/store/cv-slice";
import { SectionCard } from "@/components/section-card";
import { CVAnalysisResultsStrengths } from "./CVAnalysisResults/CVAnalysisResultsStrengths";
import { BadgeCheck, FileText, Rocket, TrendingUp, Upload } from "lucide-react";
import { formatCvCreatedAt, getUploadGuidance, roleAnalysisFromStored } from "../utils/cv-workspace";

export function CVWorkspace() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const cvs = useAppSelector((state) => state.cv.items);
  const selectedCvId = useAppSelector((state) => state.cv.selectedCvId);
  const selectedRole = useAppSelector((state) => state.cv.selectedRole);
  const latestRoleAnalysis = useAppSelector((state) => state.cv.latestRoleAnalysis);
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadIssue, setUploadIssue] = useState<ReturnType<typeof getUploadGuidance> | null>(null);
  const [customRole, setCustomRole] = useState("");

  const selectedCv = useMemo(
    () => cvs.find((item) => item.id === selectedCvId) ?? cvs[0] ?? null,
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
    try {
      const uploaded = await api.uploadCV(token, selectedFile);
      setUploadIssue(null);
      setCustomRole("");
      dispatch(selectRole(null));
      dispatch(upsertCV(uploaded));
      toast.success("CV uploaded and analyzed");
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
    try {
      const result = await api.analyzeRole(token, selectedCv.id, role);
      dispatch(setRoleAnalysis(result));
      toast.success(`Re-analyzed for ${role}`);
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

  const recommendedRoles = latestRoleAnalysis?.recommended_roles ?? [];
  const analysis = latestRoleAnalysis?.analysis;
  const structured = latestRoleAnalysis?.structured_data;
  const detectedSkills = structured?.skills ?? [];
  const hasDetectedProfileSignals = Boolean(structured?.summary || structured?.experience?.length || structured?.projects?.length || detectedSkills.length);

  return (
    <div className="space-y-6">
      <SectionCard
        title="CV Analysis Workspace"
        description="Upload your latest resume, inspect role fit, and see the strongest next improvements."
        className="overflow-hidden border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,245,236,0.92))] p-7 lg:p-8"
      >
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_26%),linear-gradient(135deg,rgba(248,250,252,0.98),rgba(255,248,240,0.96))] p-6 shadow-[0_26px_55px_rgba(56,56,40,0.08)]">
            <div className="absolute right-[-38px] top-[-42px] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.16),transparent_68%)]" />
            <div className="absolute bottom-[-46px] left-[18%] h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.12),transparent_72%)]" />
            <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-2xl">
                <h3 className="max-w-3xl text-2xl font-semibold tracking-tight text-stone-950 sm:text-[2rem] sm:leading-[1.18]">
                  Give every CV upload a sharper role direction and a better next step.
                </h3>
                <p className="mt-4 max-w-3xl text-[15px] leading-8 text-stone-600 sm:text-base">
                  Keep the workflow simple: upload a clean resume, review the strongest profile signals, and move into role-fit analysis with a workspace that feels focused and polished.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[420px]">
                <div className="rounded-[24px] border border-white/80 bg-white/78 px-4 py-4 shadow-[0_15px_30px_rgba(39,39,32,0.06)] backdrop-blur">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <BadgeCheck className="h-4 w-4" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Supported</span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-stone-950">PDF, DOCX, TXT</p>
                  <p className="mt-1 text-xs leading-5 text-stone-500">Text-based files give the cleanest results.</p>
                </div>
                <div className="rounded-[24px] border border-white/80 bg-white/78 px-4 py-4 shadow-[0_15px_30px_rgba(39,39,32,0.06)] backdrop-blur">
                  <div className="flex items-center gap-2 text-sky-700">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Recent list</span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-stone-950">{recentCvs.length}/4 visible</p>
                  <p className="mt-1 text-xs leading-5 text-stone-500">Your newest uploads stay ready for quick switching.</p>
                </div>
                <div className="rounded-[24px] border border-white/80 bg-white/78 px-4 py-4 shadow-[0_15px_30px_rgba(39,39,32,0.06)] backdrop-blur">
                  <div className="flex items-center gap-2 text-amber-700">
                    <Rocket className="h-4 w-4" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Goal</span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-stone-950">Role fit + next skills</p>
                  <p className="mt-1 text-xs leading-5 text-stone-500">Use the analysis to pick a stronger direction.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(252,249,244,0.94))] p-6 shadow-[0_20px_44px_rgba(56,56,40,0.06)]">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">Workflow guide</p>
            <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-3">
                <div className="rounded-[24px] border border-black/8 bg-white/86 px-4 py-4 shadow-[0_12px_24px_rgba(39,39,32,0.05)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">Step 1</p>
                  <p className="mt-3 text-lg font-semibold leading-7 text-stone-950">Extract readable text</p>
                </div>
                <div className="rounded-[24px] border border-black/8 bg-white/86 px-4 py-4 shadow-[0_12px_24px_rgba(39,39,32,0.05)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">Step 2</p>
                  <p className="mt-3 text-lg font-semibold leading-7 text-stone-950">Analyze role signals</p>
                </div>
                <div className="rounded-[24px] border border-black/8 bg-white/86 px-4 py-4 shadow-[0_12px_24px_rgba(39,39,32,0.05)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">Step 3</p>
                  <p className="mt-3 text-lg font-semibold leading-7 text-stone-950">Surface next skills</p>
                </div>
              </div>
              <div className="rounded-[26px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,247,245,0.9))] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500">How It Works</p>
                <div className="mt-3 space-y-3 text-sm leading-7 text-stone-700">
                  <p>1. Upload your CV and we extract the readable text from the file.</p>
                  <p>2. We analyze your skills, profile details, and role fit from that text.</p>
                  <p>3. You get recommended roles, missing skills, and a clearer direction for improvement.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.02fr_1.08fr]">
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
              <label className="mt-5 block cursor-pointer rounded-[26px] border border-dashed border-sky-300 bg-[linear-gradient(180deg,rgba(245,250,255,0.95),rgba(255,255,255,0.92))] px-5 py-6 shadow-[0_16px_34px_rgba(59,130,246,0.08)] transition hover:border-sky-400 hover:shadow-[0_18px_38px_rgba(59,130,246,0.12)]">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={(event) => {
                    setSelectedFile(event.target.files?.[0] ?? null);
                    setUploadIssue(null);
                  }}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex min-w-0 flex-col items-center gap-3">
                    <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-stone-900">{selectedFile ? selectedFile.name : "Choose your CV file"}</p>
                    </div>
                  </div>
                  <span className="inline-flex min-w-[132px] items-center justify-center rounded-full bg-stone-950 px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.16em] text-white">
                    Browse file
                  </span>
                </div>
              </label>
              {uploadIssue ? (
                <div className="mt-4 rounded-[22px] border border-red-200 bg-[linear-gradient(180deg,rgba(255,245,245,0.98),rgba(255,236,236,0.94))] px-4 py-4 text-red-800 shadow-[0_12px_28px_rgba(185,28,28,0.08)]">
                  <p className="text-sm font-semibold">{uploadIssue.title}</p>
                  <p className="mt-2 text-sm">{uploadIssue.summary}</p>
                  <div className="mt-3 space-y-2 text-sm">
                    {uploadIssue.steps.map((step) => (
                      <p key={step}>{step}</p>
                    ))}
                  </div>
                  <p className="mt-3 text-sm font-medium">{uploadIssue.tip}</p>
                </div>
              ) : null}
              <button
                onClick={() => void uploadCV()}
                disabled={!selectedFile || isPending}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-[22px] bg-[linear-gradient(135deg,#4e8df7,#346ee8)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(52,110,232,0.28)] transition hover:translate-y-[-1px] hover:shadow-[0_22px_40px_rgba(52,110,232,0.34)] disabled:opacity-60"
              >
                {isPending ? "Working..." : "Upload and analyze"}
                <Rocket className="h-4 w-4" />
              </button>
            </div>
            <div className="rounded-[30px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(250,248,243,0.92))] p-6 shadow-[0_22px_45px_rgba(56,56,40,0.06)]">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700">Recent CV library</p>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-stone-950">Saved CV versions</p>
                  <p className="mt-1 text-sm text-stone-500">Your latest uploads stay here for quick switching.</p>
                </div>
                <div className="rounded-[20px] bg-stone-100 p-3 text-stone-700">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {recentCvs.length ? (
                  recentCvs.map((cv, index) => (
                    <button
                      key={cv.id}
                      onClick={() => dispatch(selectCv(cv.id))}
                      className={`relative w-full overflow-hidden rounded-[24px] border px-4 py-4 text-left transition ${
                        selectedCv?.id === cv.id
                          ? "border-emerald-500 bg-[linear-gradient(135deg,rgba(232,250,239,1),rgba(240,255,246,0.96))] shadow-[0_14px_28px_rgba(20,83,45,0.12)]"
                          : "border-black/8 bg-white/92 hover:border-sky-200 hover:bg-stone-50 hover:shadow-[0_12px_26px_rgba(31,31,28,0.06)]"
                      }`}
                    >
                      <div className="absolute inset-y-0 left-0 w-1 rounded-full bg-[linear-gradient(180deg,#60a5fa,#10b981)] opacity-75" />
                      <div className="flex items-center justify-between gap-3 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-100 text-xs font-semibold text-stone-600">
                            0{index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-stone-900">{formatCvCreatedAt(cv.created_at)}</p>
                            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-stone-400">Saved version</p>
                          </div>
                        </div>
                        {selectedCv?.id === cv.id ? (
                          <span className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                            Active
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-3 line-clamp-2 pl-2 text-xs leading-5 text-stone-600">
                        {cv.raw_text?.slice(0, 150) || "No extracted text preview"}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="rounded-[24px] border border-dashed border-black/10 bg-stone-50/80 px-4 py-8 text-center text-sm text-stone-500">
                    No uploaded CVs yet. Your recent versions will appear here after the first upload.
                  </div>
                )}
              </div>
              {cvs.length > 4 ? (
                <div className="mt-4 rounded-[22px] bg-stone-50 px-4 py-3 text-xs leading-5 text-stone-500">
                  Showing the latest 4 CV versions here. Older uploads stay available in <span className="font-semibold text-stone-700">CV History</span>.
                </div>
              ) : null}
              <div className="mt-4 rounded-[22px] border border-sky-100 bg-[linear-gradient(180deg,rgba(245,250,255,0.9),rgba(255,255,255,0.94))] px-4 py-3 text-xs leading-5 text-stone-600">
                Quick flow: upload a fresh CV, switch between recent versions here, then continue with the role direction below.
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Recommended Roles" description="Choose the primary role you want this CV optimized for.">
          <div className="space-y-3">
            <div className="rounded-2xl border border-black/10 bg-stone-50 p-4">
              <p className="text-sm font-semibold text-stone-900">Choose or enter a role</p>
              <p className="mt-1 text-sm text-stone-600">
                If no suggested role appears, type the role you want and run the analysis yourself.
              </p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  value={customRole}
                  onChange={(event) => setCustomRole(event.target.value)}
                  placeholder="Example: Mechanical Engineer"
                  className="min-w-0 flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-stone-900 outline-none"
                />
                <button
                  onClick={() => void analyzeCustomRole()}
                  disabled={!selectedCv || isPending}
                  className="rounded-2xl bg-stone-950 px-4 py-3 text-sm font-semibold text-stone-50 disabled:opacity-60"
                >
                  Analyze this role
                </button>
              </div>
            </div>
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
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-amber-900">
                <p className="text-sm font-semibold">We could not confidently detect the CV field yet</p>
                <p className="mt-2 text-sm">
                  {hasDetectedProfileSignals
                    ? "The CV text was uploaded, but we could not find enough reliable skill or role signals to assign recommended roles."
                    : "This CV does not contain enough readable summary, skills, or experience details to assign recommended roles automatically."}
                </p>
                <p className="mt-3 text-sm">
                  Type your own target role above, for example <span className="font-semibold">HR</span>, <span className="font-semibold">Mechanical Engineer</span>, or <span className="font-semibold">QA Engineer</span>, and we will generate the role-fit breakdown for that role.
                </p>
              </div>
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
            <p className="text-sm text-stone-500">
              Role analysis will appear here after you upload a CV and choose a suggested role or enter your own role.
            </p>
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
            {detectedSkills.length ? (
              <div className="flex flex-wrap gap-2">
                {detectedSkills.map((skill) => (
                  <span key={skill} className="rounded-full border border-black/10 bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-500">
                No reliable skills were detected from this CV yet. You can still type your own target role above and analyze it manually.
              </p>
            )}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
