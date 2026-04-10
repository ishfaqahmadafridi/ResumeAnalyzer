export function TimelineEmptyState({ isPending }: { isPending: boolean }) {
  return (
    <div className="rounded-2xl border border-dashed border-black/10 bg-stone-50 px-4 py-10 text-center text-sm text-stone-500">
      {isPending ? "Loading your CV history..." : "No CV uploads from the last 7 days are available."}
    </div>
  );
}
