export function InterviewRoleDisplay({ activeInterviewRole }: { activeInterviewRole: string | null }) {
  return (
    <div>
      <p className="text-base font-semibold text-stone-950">Role</p>
      <p className="mt-2 text-sm font-medium text-stone-700">{activeInterviewRole || "No role selected yet"}</p>
    </div>
  );
}
