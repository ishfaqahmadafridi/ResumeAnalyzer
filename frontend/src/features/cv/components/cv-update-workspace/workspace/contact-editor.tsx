import type { CVSection } from "@/features/cv/types/update";
import type { ContactFields } from "@/features/cv/types/types";
import { buildContact, parseContact } from "@/features/cv/utils/contact-utils";

export function ContactEditor({
  section,
  onSetItems,
}: {
  section: CVSection;
  onSetItems: (items: string[]) => void;
}) {
  const fields = parseContact(section.items);

  const updateField = (field: keyof Omit<ContactFields, "other">, value: string) => {
    onSetItems(
      buildContact({
        ...fields,
        [field]: value,
      }),
    );
  };

  return (
    <div className="grid gap-3">
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-stone-600">Phone</span>
        <input
          value={fields.contact}
          onChange={(event) => updateField("contact", event.target.value)}
          placeholder="+92 300 0000000"
          className="rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald-500 focus:bg-white"
        />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-stone-600">Email</span>
        <input
          value={fields.email}
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="name@example.com"
          className="rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald-500 focus:bg-white"
        />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-stone-600">GitHub</span>
        <input
          value={fields.github}
          onChange={(event) => updateField("github", event.target.value)}
          placeholder="https://github.com/username"
          className="rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald-500 focus:bg-white"
        />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-stone-600">LinkedIn</span>
        <input
          value={fields.linkedin}
          onChange={(event) => updateField("linkedin", event.target.value)}
          placeholder="https://linkedin.com/in/username"
          className="rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald-500 focus:bg-white"
        />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-stone-600">Address</span>
        <input
          value={fields.address}
          onChange={(event) => updateField("address", event.target.value)}
          placeholder="City, Country"
          className="rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald-500 focus:bg-white"
        />
      </label>
    </div>
  );
}
