import { JobsWorkflowJobCard } from "./jobs-workflow-job-card";

interface Props {
  jobs?: any[];
}

export function JobsWorkflowJobsList({ jobs = [] }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold text-stone-900">Jobs</p>
      <div className="mt-3 space-y-3">
        {jobs.length > 0 ? (
          jobs.map((job, index) => (
            <JobsWorkflowJobCard key={job.url || index} job={job} />
          ))
        ) : (
          <p className="text-sm text-stone-500">No jobs found in this run.</p>
        )}
      </div>
    </div>
  );
}
