"use client";

import { useMemo } from "react";
import { SectionCard } from "@/components/ui/section-card";
import { useCVUpdate } from "@/features/cv/hooks/use-cv-update";
import { UpdateCVComparison } from "../comparison/update-cv-comparison";
import { UpdateCVToolbar } from "../update-cv-toolbar";
import { CVPreview } from "./cv-preview";
import { EditPanel } from "./edit-panel";

export function CVUpdateWorkspace() {
  const {
    loading,
    saving,
    aiStatus,
    activeCvName,
    baseline,
    data,
    diff,
    showCompare,
    suggestionHints,
    setShowCompare,
    updateName,
    setSectionItems,
    addSectionItems,
    removeSectionItem,
    improveWithAI,
    saveUpdatedCV,
    downloadPdf,
  } = useCVUpdate();

  const improvements = useMemo(() => suggestionHints.improvements ?? [], [suggestionHints.improvements]);
  const suggestedSkills = useMemo(() => suggestionHints.skills ?? [], [suggestionHints.skills]);

  return (
    <div className="space-y-6">
      <SectionCard
        title="Update CV"
        description={`Editing source: ${activeCvName}. Structured editing with live preview inspired by the CV maker reference.`}
      >
        <UpdateCVToolbar
          aiStatus={aiStatus}
          saving={saving}
          showCompare={showCompare}
          setShowCompare={setShowCompare}
          onAIImprove={improveWithAI}
          onSave={saveUpdatedCV}
          onDownload={downloadPdf}
        />
      </SectionCard>

      {!showCompare ? (
        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <SectionCard title="Edit Your CV" description="Open a section, edit its data, and watch the preview update live.">
            {loading ? (
              <p className="text-sm text-stone-600">Loading CV details...</p>
            ) : (
              <EditPanel
                baseline={baseline}
                data={data}
                updateName={updateName}
                setSectionItems={setSectionItems}
                addSectionItems={addSectionItems}
                removeSectionItem={removeSectionItem}
                improvements={improvements}
                suggestedSkills={suggestedSkills}
              />
            )}
          </SectionCard>

          <SectionCard title="Live Preview" description="A cleaner live CV preview inspired by the reference CV maker repository.">
            {loading ? <p className="text-sm text-stone-600">Preparing preview...</p> : <CVPreview data={data} />}
          </SectionCard>
        </div>
      ) : (
        <SectionCard title="Compare Changes" description="Left is old CV, right is improved CV. Which version do you prefer?">
          <UpdateCVComparison previous={baseline} updated={data} diff={diff} />
        </SectionCard>
      )}
    </div>
  );
}
