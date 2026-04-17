import type { CVSection } from "@/features/cv/types/update";
import { isListStyleSection } from "@/features/cv/utils/is-list-style-section";
import { sectionLabel } from "@/features/cv/utils/section-label";

export function PreviewSection({ section }: { section: CVSection }) {
  if (!section.items.length || section.key === "contact") {
    return null;
  }

  if (section.key === "about") {
    return (
      <section className="mt-5 border-t border-stone-300 pt-3">
        <h3 className="mb-2 text-lg font-bold uppercase tracking-wide text-stone-900">{sectionLabel(section)}</h3>
        {section.items.map((item, index) => (
          <p key={`${item}-${index}`} className="mb-2 text-sm leading-6 text-stone-700">
            {item}
          </p>
        ))}
      </section>
    );
  }

  if (isListStyleSection(section.key)) {
    return (
      <section className="mt-5 border-t border-stone-300 pt-3">
        <h3 className="mb-2 text-lg font-bold uppercase tracking-wide text-stone-900">{sectionLabel(section)}</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-stone-700">
          {section.items.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="mt-5 border-t border-stone-300 pt-3">
      <h3 className="mb-2 text-lg font-bold uppercase tracking-wide text-stone-900">{sectionLabel(section)}</h3>
      <div className="space-y-3">
        {section.items.map((item, index) => (
          <div key={`${item}-${index}`} className="text-sm leading-6 text-stone-700">
            <p>{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
