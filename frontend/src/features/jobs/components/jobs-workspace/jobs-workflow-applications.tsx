import { JobsWorkflowApplicationCard } from "./jobs-workflow-application-card";

interface Props {
  applications?: any[];
}

export function JobsWorkflowApplications({ applications = [] }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold text-stone-900">Prepared applications</p>
      <div className="mt-3 space-y-3">
        {applications.length > 0 ? (
          applications.map((application, index) => (
            <JobsWorkflowApplicationCard key={application.job_title || index} application={application} />
          ))
        ) : (
          <p className="text-sm text-stone-500">No applications prepared in this run.</p>
        )}
      </div>
    </div>
  );
}
