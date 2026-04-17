import { useState } from "react";
import { Plus, X } from "lucide-react";

export function TextBlockEditor({
  items,
  addLabel,
  placeholder,
  onAdd,
  onRemove,
}: {
  items: string[];
  addLabel: string;
  placeholder: string;
  onAdd: (value: string) => void;
  onRemove: (itemIndex: number) => void;
}) {
  const [draft, setDraft] = useState("");

  const submit = () => {
    const value = draft.trim();
    if (!value) return;
    onAdd(value);
    setDraft("");
  };

  return (
    <div className="grid gap-3">
      <div className="grid gap-2">
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-start gap-2 rounded-xl border border-stone-200 bg-stone-50 p-3">
            <p className="flex-1 whitespace-pre-wrap break-words text-sm leading-6 text-stone-700">{item}</p>
            <button type="button" onClick={() => onRemove(index)} className="text-emerald-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <textarea
        rows={4}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        className="rounded-xl border border-stone-300 bg-stone-50 px-3 py-3 text-sm leading-6 text-stone-900 outline-none transition focus:border-emerald-500 focus:bg-white"
      />

      <div className="flex justify-start">
        <button
          type="button"
          onClick={submit}
          className="inline-flex items-center gap-1 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
        >
          <Plus className="h-4 w-4" />
          {addLabel}
        </button>
      </div>
    </div>
  );
}
