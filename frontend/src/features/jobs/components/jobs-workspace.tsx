"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { EyeOff, Plus } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { SectionCard } from "@/components/section-card";
import { useAppSelector } from "@/store";
import { useNotificationStore } from "@/store/notification-store";
import type { AgentWorkflowResult } from "@/types";

type PlatformEntry = {
  id: string;
  label: string;
  enabled: boolean;
  link: string;
  hidden?: boolean;
};

const defaultPlatforms: PlatformEntry[] = [
  { id: "github", label: "GitHub", enabled: true, link: "" },
  { id: "linkedin", label: "LinkedIn", enabled: true, link: "" },
  { id: "indeed", label: "Indeed", enabled: true, link: "" },
  { id: "rozee", label: "Rozee", enabled: false, link: "" },
];
const PLATFORM_STORAGE_KEY = "cvforge-platform-connections";

function toPlatformId(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export function JobsWorkspace() {
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const cvs = useAppSelector((state) => state.cv.items);
  const selectedCvId = useAppSelector((state) => state.cv.selectedCvId);
  const activeCv = useMemo(
    () => cvs.find((cv) => cv.id === selectedCvId) ?? cvs[0] ?? null,
    [cvs, selectedCvId],
  );

  const [workflow, setWorkflow] = useState<AgentWorkflowResult | null>(null);
  const [platforms, setPlatforms] = useState<PlatformEntry[]>(() => {
    if (typeof window === "undefined") {
      return defaultPlatforms;
    }

    try {
      const stored = window.localStorage.getItem(PLATFORM_STORAGE_KEY);
      if (!stored) {
        return defaultPlatforms;
      }

      const parsed = JSON.parse(stored) as PlatformEntry[];
      return Array.isArray(parsed) && parsed.length ? parsed : defaultPlatforms;
    } catch {
      return defaultPlatforms;
    }
  });
  const [customPlatformName, setCustomPlatformName] = useState("");
  const [isPending, startTransition] = useTransition();
  const addNotification = useNotificationStore((state) => state.addNotification);

  const selectedPlatforms = useMemo(
    () => platforms.filter((platform) => platform.enabled && !platform.hidden).map((platform) => platform.label),
    [platforms],
  );
  const visiblePlatforms = useMemo(() => platforms.filter((platform) => !platform.hidden), [platforms]);
  const hiddenPlatforms = useMemo(() => platforms.filter((platform) => platform.hidden), [platforms]);

  useEffect(() => {
    try {
      window.localStorage.setItem(PLATFORM_STORAGE_KEY, JSON.stringify(platforms));
    } catch {}
  }, [platforms]);

  function updatePlatform(id: string, updates: Partial<PlatformEntry>) {
    setPlatforms((current) =>
      current.map((platform) => (platform.id === id ? { ...platform, ...updates } : platform)),
    );
  }

  function addCustomPlatform() {
    const name = customPlatformName.trim();
    if (!name) {
      toast.error("Enter a platform name first");
      return;
    }

    const id = toPlatformId(name);
    if (platforms.some((platform) => platform.id === id)) {
      toast.error("That platform is already added");
      return;
    }

    setPlatforms((current) => [
      ...current,
      {
        id,
        label: name,
        enabled: true,
        link: "",
      },
    ]);
    setCustomPlatformName("");
    toast.success(`${name} added`);
  }

  function hidePlatform(id: string) {
    setPlatforms((current) =>
      current.map((platform) => (platform.id === id ? { ...platform, hidden: true, enabled: false } : platform)),
    );
    toast.success("Platform hidden");
  }

  function unhidePlatform(id: string) {
    setPlatforms((current) =>
      current.map((platform) => (platform.id === id ? { ...platform, hidden: false } : platform)),
    );
    toast.success("Platform restored");
  }

  function runWorkflow() {
    if (!token || !user || !activeCv?.raw_text) {
      toast.error("Upload and analyze a CV first");
      return;
    }

    startTransition(async () => {
      try {
        const result = await api.orchestrate(token, {
          user_id: user.id,
          cv_text: `${activeCv.raw_text}\nPlatforms: ${selectedPlatforms.join(", ")}\nProfiles: ${JSON.stringify(
            Object.fromEntries(platforms.map((platform) => [platform.id, platform.link])),
          )}`,
        });
        setWorkflow(result);
        toast.success("Job workflow generated");
        
        // Add a notification when the agent finds job recommendations
        addNotification({
          title: "New Job Matches Found",
          message: `Your agent successfully found job recommendations across ${selectedPlatforms.length} platforms. Expand this message to see the details and links to apply. Are you ready to apply?`,
          threadId: result.thread_id,
          actionRequired: "approval",
          jobs: result.jobs?.map((job: any) => ({
            title: job.title || "Unknown Role",
            company: job.company || "Unknown Company",
            location: job.location || "Remote",
            url: job.url || job.source || "#",
          }))
        });
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
            <div className="rounded-[24px] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,245,240,0.92))] p-4">
              <p className="text-sm font-semibold text-stone-900">Add another platform</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  value={customPlatformName}
                  onChange={(event) => setCustomPlatformName(event.target.value)}
                  placeholder="Type a platform name"
                  className="min-w-0 flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
                />
                <button
                  onClick={addCustomPlatform}
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-stone-950 px-4 py-3 text-sm font-semibold text-white"
                >
                  <Plus className="h-4 w-4" />
                  Add platform
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {visiblePlatforms.map((platform) => (
                <div key={platform.id} className="rounded-2xl border border-black/10 bg-stone-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <label className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-stone-900">{platform.label}</span>
                      <input
                        type="checkbox"
                        checked={platform.enabled}
                        onChange={(event) => updatePlatform(platform.id, { enabled: event.target.checked })}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => hidePlatform(platform.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:text-stone-950"
                    >
                      <EyeOff className="h-3.5 w-3.5" />
                      Hide
                    </button>
                  </div>
                  <input
                    value={platform.link}
                    onChange={(event) => updatePlatform(platform.id, { link: event.target.value })}
                    placeholder={`Paste your ${platform.label} profile URL or username`}
                    className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
                  />
                </div>
              ))}
            </div>

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

            {hiddenPlatforms.length ? (
              <div className="rounded-[24px] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,244,241,0.92))] p-4">
                <p className="text-sm font-semibold text-stone-900">Hidden platforms</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {hiddenPlatforms.map((platform) => (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => unhidePlatform(platform.id)}
                      className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-stone-700 transition hover:text-stone-950"
                    >
                      Unhide {platform.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
