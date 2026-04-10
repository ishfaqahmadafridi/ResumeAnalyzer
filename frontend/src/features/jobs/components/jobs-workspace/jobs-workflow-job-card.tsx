interface Props {
  job: any;
}

export function JobsWorkflowJobCard({ job }: Props) {
  return (
    <div className="rounded-2xl border border-black/10 bg-stone-50 p-4">
      <p className="text-sm font-semibold text-stone-900">{job.title}</p>
      <p className="mt-1 text-xs text-stone-600">
        {job.company} &bull; {job.location} &bull; {job.source}
      </p>
    </div>
  );
}
