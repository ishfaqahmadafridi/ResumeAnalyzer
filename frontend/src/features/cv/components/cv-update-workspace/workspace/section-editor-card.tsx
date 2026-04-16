import { Eye } from "lucide-react";
import type { CVSection } from "@/features/cv/types/update";
import { sectionLabel } from "@/features/cv/utils/section-label";
import { SectionEditor } from "./section-editor";

export function SectionEditorCard({
  section,
  isOpen,
  setActiveSectionId,
  setSectionItems,
  addSectionItems,
  removeSectionItem,
}: {
  section: CVSection;
  isOpen: boolean;
  setActiveSectionId: (updater: (current: string | null) => string | null) => void;
  setSectionItems: (id: string, items: string[]) => void;
  addSectionItems: (id: string, value: string) => void;
  removeSectionItem: (id: string, itemIndex: number) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setActiveSectionId((current) => (current === section.id ? null : section.id))}
        className="flex w-full items-center justify-between border-b border-stone-200 bg-stone-50 px-4 py-3 text-left"
      >
        <div>
          <p className="text-sm font-semibold text-stone-900">{sectionLabel(section)}</p>
          <p className="text-xs text-stone-500">{section.items.length} item(s)</p>
        </div>
        <Eye className={`h-4 w-4 text-stone-500 transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen ? (
        <div className="p-4">
          <SectionEditor
            section={section}
            setSectionItems={setSectionItems}
            addSectionItems={addSectionItems}
            removeSectionItem={removeSectionItem}
          />
        </div>
      ) : null}
    </div>
  );
}
