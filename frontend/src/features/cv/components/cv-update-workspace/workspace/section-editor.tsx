import type { CVSection } from "@/features/cv/types/update";
import { isListStyleSection } from "@/features/cv/utils/is-list-style-section";
import { sectionLabel } from "@/features/cv/utils/section-label";
import { ChipsEditor } from "./chips-editor";
import { ContactEditor } from "./contact-editor";
import { TextBlockEditor } from "./text-block-editor";

export function SectionEditor({
  section,
  setSectionItems,
  addSectionItems,
  removeSectionItem,
}: {
  section: CVSection;
  setSectionItems: (id: string, items: string[]) => void;
  addSectionItems: (id: string, value: string) => void;
  removeSectionItem: (id: string, itemIndex: number) => void;
}) {
  if (section.key === "contact") {
    return <ContactEditor section={section} onSetItems={(items) => setSectionItems(section.id, items)} />;
  }

  if (isListStyleSection(section.key)) {
    return (
      <ChipsEditor
        items={section.items}
        placeholder={`Add ${sectionLabel(section).toLowerCase()} item`}
        onAdd={(value) => addSectionItems(section.id, value)}
        onRemove={(index) => removeSectionItem(section.id, index)}
      />
    );
  }

  return (
    <TextBlockEditor
      items={section.items}
      addLabel={`Add ${sectionLabel(section)}`}
      placeholder={`Add ${sectionLabel(section).toLowerCase()} text or block`}
      onAdd={(value) => addSectionItems(section.id, value)}
      onRemove={(index) => removeSectionItem(section.id, index)}
    />
  );
}
