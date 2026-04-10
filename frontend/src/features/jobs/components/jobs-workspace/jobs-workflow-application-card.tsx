interface Props {
  application: any;
}

export function JobsWorkflowApplicationCard({ application }: Props) {
  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50 p-4">
      <p className="text-sm font-semibold text-stone-900">{application.job_title}</p>
      <p className="mt-2 text-sm text-stone-600">{application.cover_note}</p>
    </div>
  );
}
