interface Props {
  isPending: boolean;
  runWorkflow: () => void;
}

export function JobsWorkflowButton({ isPending, runWorkflow }: Props) {
  return (
    <button
      onClick={runWorkflow}
      disabled={isPending}
      className="w-full rounded-2xl bg-emerald-900 px-4 py-3 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-800 disabled:opacity-60 disabled:hover:bg-emerald-900"
    >
      {isPending ? "Running workflow..." : "Run auto-apply workflow"}
    </button>
  );
}
