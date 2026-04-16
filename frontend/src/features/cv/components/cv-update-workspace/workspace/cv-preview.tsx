import type { CVEditorData, CVSection } from "@/features/cv/types/update";
import { parseContact } from "@/features/cv/utils/contact-utils";
import { PreviewSection } from "./preview-section";

export function CVPreview({ data }: { data: CVEditorData }) {
  const sections: CVSection[] = data.sections ?? [];
  const name = data.name ?? "";
  const contactSection = sections.find((section) => section.key === "contact") || null;
  const contact = parseContact(contactSection?.items ?? []);

  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-100 p-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 border-b-4 border-stone-400 pb-4 sm:flex-row">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-stone-950">{name || "Your Name"}</h1>
          </div>
          <div className="space-y-1 text-sm text-stone-700 sm:text-right">
            {contact.email ? <p>{contact.email}</p> : null}
            {contact.contact ? <p>{contact.contact}</p> : null}
            {contact.linkedin ? <p>{contact.linkedin}</p> : null}
            {contact.github ? <p>{contact.github}</p> : null}
            {contact.address ? <p>{contact.address}</p> : null}
            {contact.other.map((item, index) => (
              <p key={`${item}-${index}`}>{item}</p>
            ))}
          </div>
        </div>

        {sections.map((section) => (
          <PreviewSection key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}
