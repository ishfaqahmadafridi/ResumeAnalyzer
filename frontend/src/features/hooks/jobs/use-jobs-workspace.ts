import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAppSelector } from "@/store";
import { useNotificationStore } from "@/store/notification-store";
import type { AgentWorkflowResult } from "@/types";
import { getStoredPlatforms, storePlatforms, toPlatformId } from "@/features/utils/jobs/workspace-calculations";
import type { PlatformEntry, UseJobsWorkspaceResult } from "@/features/types/jobs/workspace";

export function useJobsWorkspace(): UseJobsWorkspaceResult {
  const token = useAppSelector((state: any) => state.auth.token);
  const user = useAppSelector((state: any) => state.auth.user);
  const cvs = useAppSelector((state: any) => state.cv.items);
  const selectedCvId = useAppSelector((state: any) => state.cv.selectedCvId);
  const activeCv = useMemo(
    () => cvs.find((cv: any) => cv.id === selectedCvId) ?? cvs[0] ?? null,
    [cvs, selectedCvId],
  );

  const [workflow, setWorkflow] = useState<AgentWorkflowResult | null>(null);
  const [platforms, setPlatforms] = useState<PlatformEntry[]>(getStoredPlatforms);
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
    storePlatforms(platforms);
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
        
        addNotification({
          title: "New Job Matches Found",
          message: `Your agent successfully found job recommendations across ${selectedPlatforms.length} platforms. Expand this message to see the details and links to apply. Are you ready to apply?`,
          threadId: result.thread_id ?? "",
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

  return {
    workflow,
    customPlatformName,
    setCustomPlatformName,
    isPending,
    visiblePlatforms,
    hiddenPlatforms,
    addCustomPlatform,
    updatePlatform,
    hidePlatform,
    unhidePlatform,
    runWorkflow,
  };
}
