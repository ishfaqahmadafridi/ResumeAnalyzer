import { useState } from "react";
import type { CVEditorData } from "@/features/cv/types/update";
import { IdentityEditorCard } from "./identity-editor-card";
import { ImprovementsCard } from "./improvements-card";
import { SectionEditorCard } from "./section-editor-card";
import { SuggestedSkillsCard } from "./suggested-skills-card";

export function EditPanel({
  baseline,
  data,
  updateName,
  setSectionItems,
  addSectionItems,
  removeSectionItem,
  improvements,
  suggestedSkills,
}: {
  baseline: CVEditorData;
  data: CVEditorData;
  updateName: (value: string) => void;
  setSectionItems: (id: string, items: string[]) => void;
  addSectionItems: (id: string, value: string) => void;
  removeSectionItem: (id: string, itemIndex: number) => void;
  improvements: string[];
  suggestedSkills: string[];
}) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <IdentityEditorCard baseline={baseline} data={data} updateName={updateName} />

      {data.sections.map((section) => {
        const isOpen = activeSectionId === section.id;
        return (
          <SectionEditorCard
            key={section.id}
            section={section}
            isOpen={isOpen}
            setActiveSectionId={setActiveSectionId}
            setSectionItems={setSectionItems}
            addSectionItems={addSectionItems}
            removeSectionItem={removeSectionItem}
          />
        );
      })}

      <ImprovementsCard improvements={improvements} />
      <SuggestedSkillsCard suggestedSkills={suggestedSkills} />
    </div>
  );
}
