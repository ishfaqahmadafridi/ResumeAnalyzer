interface Props {
  rawText?: string;
  details?: string;
}

export function TimelineCardPreview({ rawText, details }: Props) {
  return (
    <>
      <p className="mt-4 break-words text-xs leading-6 text-stone-600">
        {rawText?.slice(0, 180) || "No extracted text preview available for this upload."}
      </p>
      {details ? (
        <p className="mt-3 break-words text-xs font-medium text-stone-500">{details}</p>
      ) : null}
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
        Open this version
      </p>
    </>
  );
}
