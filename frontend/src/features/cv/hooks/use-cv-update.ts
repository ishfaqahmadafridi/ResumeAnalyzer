import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/store";
import { setCVs, upsertCV } from "@/store/cv-slice";
import type { CVEditorData, UseCVUpdateResult } from "@/features/cv/types/update";
import {
  addItemsToSection,
  buildCvRawText,
  calculateCvDiff,
  emptyEditorData,
  normalizeSectionItems,
  parseCvTextToEditorData,
  sectionsFromPayload,
  sectionsToPayload,
} from "@/features/cv/utils/update";
import { downloadUpdatedCvPdf } from "@/features/cv/utils/update-pdf";

const EMPTY_EDITOR = emptyEditorData();

function cloneEditorData(source: CVEditorData): CVEditorData {
  return {
    name: source.name,
    sections: source.sections.map((section) => ({
      ...section,
      items: [...section.items],
    })),
  };
}

function buildSectionId(index: number): string {
  return `custom-${Date.now()}-${index}`;
}

export function useCVUpdate(): UseCVUpdateResult {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state: any) => state.auth.token);
  const user = useAppSelector((state: any) => state.auth.user);
  const cvs = useAppSelector((state: any) => state.cv.items);
  const selectedCvId = useAppSelector((state: any) => state.cv.selectedCvId);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiStatus, setAiStatus] = useState<"idle" | "pending" | "done" | "failed">("idle");
  const [showCompare, setShowCompare] = useState(false);
  const [baseline, setBaseline] = useState<CVEditorData>(EMPTY_EDITOR);
  const [data, setData] = useState<CVEditorData>(EMPTY_EDITOR);
  const [suggestionHints, setSuggestionHints] = useState<Record<string, string[]>>({});

  const activeCv = useMemo(
    () => cvs.find((item: any) => item.id === selectedCvId) ?? cvs[0] ?? null,
    [cvs, selectedCvId],
  );

  useEffect(() => {
    if (!token || cvs.length) {
      return;
    }

    let active = true;
    setLoading(true);

    api
      .listCVs(token)
      .then((records) => {
        if (!active) return;
        dispatch(setCVs(records));
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Failed to load CVs");
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [cvs.length, dispatch, token]);

  useEffect(() => {
    if (!activeCv) {
      setBaseline(EMPTY_EDITOR);
      setData(EMPTY_EDITOR);
      return;
    }

    const parsed = parseCvTextToEditorData(activeCv);
    setBaseline(cloneEditorData(parsed));
    setData(cloneEditorData(parsed));
    setSuggestionHints({});
    setAiStatus("idle");
    setShowCompare(false);
  }, [activeCv]);

  const diff = useMemo(() => calculateCvDiff(baseline, data), [baseline, data]);

  const updateName = useCallback((value: string) => {
    setData((current) => ({ ...current, name: value }));
  }, []);

  const addSection = useCallback(() => {
    setData((current) => ({
      ...current,
      sections: [
        ...current.sections,
        {
          id: buildSectionId(current.sections.length),
          key: "custom",
          title: "New Section",
          items: [],
        },
      ],
    }));
  }, []);

  const removeSection = useCallback((id: string) => {
    setData((current) => ({
      ...current,
      sections: current.sections.filter((section) => section.id !== id),
    }));
  }, []);

  const updateSectionTitle = useCallback((id: string, value: string) => {
    setData((current) => ({
      ...current,
      sections: current.sections.map((section) => (section.id === id ? { ...section, title: value } : section)),
    }));
  }, []);

  const setSectionItems = useCallback((id: string, items: string[]) => {
    setData((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === id
          ? {
              ...section,
              items: normalizeSectionItems(section, items),
            }
          : section,
      ),
    }));
  }, []);

  const addSectionItems = useCallback((id: string, value: string) => {
    setData((current) => ({
      ...current,
      sections: current.sections.map((section) => (section.id === id ? addItemsToSection(section, value) : section)),
    }));
  }, []);

  const removeSectionItem = useCallback((id: string, itemIndex: number) => {
    setData((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === id ? { ...section, items: section.items.filter((_, index) => index !== itemIndex) } : section,
      ),
    }));
  }, []);

  const improveWithAI = useCallback(async () => {
    if (!token || !user?.id || !activeCv) {
      toast.error("Please sign in and select a CV first.");
      return;
    }

    setAiStatus("pending");

    try {
      const result = await api.improveCV(token, {
        user_id: String(user.id),
        cv_text: activeCv.raw_text,
        cv_data: {
          name: data.name,
          sections: sectionsToPayload(data),
        },
      });

      if (!result.improved_cv) {
        throw new Error("AI improvement did not return structured content.");
      }

      const improved: CVEditorData = {
        name: result.improved_cv.name || data.name,
        sections: sectionsFromPayload(result.improved_cv.sections),
      };

      setData(improved);
      setAiStatus("done");
      setShowCompare(true);
      setSuggestionHints({
        improvements: result.improved_cv.improvements || [],
        skills: result.improved_cv.suggested_skills || [],
      });
      toast.success("AI improvement ready.");
    } catch (error) {
      setAiStatus("failed");
      toast.error(error instanceof Error ? error.message : "AI improve failed");
    }
  }, [activeCv, data, token, user?.id]);

  const saveUpdatedCV = useCallback(async () => {
    if (!token || !activeCv) {
      toast.error("No CV selected for update.");
      return;
    }

    setSaving(true);

    try {
      const baselineById = new Map(baseline.sections.map((section) => [section.id, section]));

      const normalizedForSave: CVEditorData = {
        name: data.name.trim() || baseline.name,
        sections: data.sections
          .map((section) => ({
            ...section,
            title: section.title.trim() || baselineById.get(section.id)?.title || "",
            items:
              section.items.map((item) => item.trim()).filter(Boolean).length > 0
                ? normalizeSectionItems(section, section.items)
                : baselineById.get(section.id)?.items || [],
          }))
          .filter((section) => section.title || section.items.length),
      };

      const nextRawText = buildCvRawText(normalizedForSave);
      const updated = await api.updateCVText(token, activeCv.id, nextRawText);
      dispatch(upsertCV(updated));
      setData(cloneEditorData(normalizedForSave));
      setBaseline(cloneEditorData(normalizedForSave));
      setShowCompare(false);
      toast.success("Existing CV updated in the same structure.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save updated CV");
    } finally {
      setSaving(false);
    }
  }, [activeCv, baseline.name, baseline.sections, data, dispatch, token]);

  const downloadPdf = useCallback(() => {
    downloadUpdatedCvPdf(data);
  }, [data]);

  return {
    loading,
    saving,
    aiStatus,
    activeCvName: activeCv?.encrypted_file?.split("/").pop() ?? "No CV selected",
    data,
    baseline,
    diff,
    showCompare,
    suggestionHints,
    setShowCompare,
    updateName,
    addSection,
    removeSection,
    updateSectionTitle,
    setSectionItems,
    addSectionItems,
    removeSectionItem,
    improveWithAI,
    saveUpdatedCV,
    downloadPdf,
  };
}
