"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { SectionCard } from "@/components/section-card";
import { useAppSelector } from "@/store";
import type { AgentWorkflowResult } from "@/types";

export function JobsWorkspace() {
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const cvs = useAppSelector((state) => state.cv.items);
  const latestCv = cvs[0] ?? null;
  const [workflow, setWorkflow] = useState<AgentWorkflowResult | null>(null);
  const [platforms, setPlatforms] = useState({
    linkedin: true,
    github: true,
    rozee: false,
    indeed: true,
  });
  const [links, setLinks] = useState({
    linkedin: "",
    github: "",
    rozee: "",
    indeed: "",
  });
  const [isPending, startTransition] = useTransition();

  const selectedPlatforms = useMemo(
    () => Object.entries(platforms).filter(([, enabled]) => enabled).map(([name]) => name),
    [platforms],
  );

  function runWorkflow() {
    if (!token || !user || !latestCv?.raw_text) {
      toast.error("Upload and analyze a CV first");
      return;
    }

    startTransition(async () => {
      try {
        const result = await api.orchestrate(token, {
          user_id: user.id,
          cv_text: `${latestCv.raw_text}\nPlatforms: ${selectedPlatforms.join(", ")}\nProfiles: ${JSON.stringify(links)}`,
        });
        setWorkflow(result);
        toast.success("Job workflow generated");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Workflow failed");
      }
    });
  }

  return (
    <div className="space-y-6">
      <SectionCard title="Platform Connections & Auto Apply" description="Connect public profiles, select target platforms, then trigger the backend workflow.">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            {(["linkedin", "github", "rozee", "indeed"] as const).map((platform) => (
              <div key={platform} className="rounded-2xl border border-black/10 bg-stone-50 p-4">
                <label className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold capitalize text-stone-900">{platform}</span>
                  <input
                    type="checkbox"
                    checked={platforms[platform]}
                    onChange={(event) => setPlatforms((prev) => ({ ...prev, [platform]: event.target.checked }))}
                  />
                </label>
                <input
                  value={links[platform]}
                  onChange={(event) => setLinks((prev) => ({ ...prev, [platform]: event.target.value }))}
                  placeholder={`Paste your ${platform} profile URL or username`}
                  className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
                />
              </div>
            ))}
            <button
              onClick={runWorkflow}
              disabled={isPending}
              className="w-full rounded-2xl bg-emerald-900 px-4 py-3 text-sm font-semibold text-emerald-50 disabled:opacity-60"
            >
              {isPending ? "Running workflow..." : "Run auto-apply workflow"}
            </button>
          </div>

          <div className="space-y-4">
            <div className="rounded-[26px] border border-black/10 bg-stone-950 p-5 text-stone-50">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Workflow nodes</p>
              <ol className="mt-4 space-y-3 text-sm">
                <li>1. Profile Analyzer</li>
                <li>2. Job Searcher</li>
                <li>3. Application Agent</li>
                <li>4. Notification & Logging Agent</li>
              </ol>
            </div>

            <SectionCard title="Workflow Output" description="Current backend output from the orchestration endpoint." className="bg-white">
              {workflow ? (
                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-semibold text-stone-900">Notifications</p>
                    <ul className="mt-2 space-y-2 text-sm text-stone-600">
                      {(workflow.notifications ?? []).map((notification) => (
                        <li key={notification}>{notification}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">Jobs</p>
                    <div className="mt-3 space-y-3">
                      {(workflow.jobs ?? []).map((job) => (
                        <div key={job.url} className="rounded-2xl border border-black/10 bg-stone-50 p-4">
                          <p className="text-sm font-semibold text-stone-900">{job.title}</p>
                          <p className="text-xs text-stone-600">
                            {job.company} • {job.location} • {job.source}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">Prepared applications</p>
                    <div className="mt-3 space-y-3">
                      {(workflow.applications ?? []).map((application) => (
                        <div key={application.job_title} className="rounded-2xl border border-emerald-500/20 bg-emerald-50 p-4">
                          <p className="text-sm font-semibold text-stone-900">{application.job_title}</p>
                          <p className="mt-2 text-sm text-stone-600">{application.cover_note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-stone-500">Run the workflow to see generated jobs and application drafts.</p>
              )}
            </SectionCard>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
