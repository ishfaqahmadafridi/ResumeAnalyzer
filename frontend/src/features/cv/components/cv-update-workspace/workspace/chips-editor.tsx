import { useState } from "react";
import { X } from "lucide-react";

export function ChipsEditor({
  items,
  placeholder,
  onAdd,
  onRemove,
}: {
  items: string[];
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
          <button
            key={`${item}-${index}`}
            type="button"
            onClick={() => onRemove(index)}
            className="inline-flex w-full items-start justify-between gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-2.5 py-2 text-[11px] leading-4 text-emerald-900"
          >
            <span className="break-words whitespace-normal text-left">{item}</span>
            <X className="h-3.5 w-3.5 shrink-0" />
          </button>
        ))}
      </div>

      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            submit();
          }
        }}
        placeholder={`${placeholder} (Press Enter)`}
        className="flex-1 rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-xs text-stone-900 outline-none transition focus:border-emerald-500 focus:bg-white"
      />
    </div>
  );
}
