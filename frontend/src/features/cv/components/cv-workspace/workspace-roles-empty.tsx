export function WorkspaceRolesEmpty({ hasDetectedProfileSignals }: { hasDetectedProfileSignals: boolean }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-amber-900">
      <p className="text-sm font-semibold">We could not confidently detect the CV field yet</p>
      <p className="mt-2 text-sm">
        {hasDetectedProfileSignals
          ? "The CV text was uploaded, but we could not find enough reliable skill or role signals to assign recommended roles."
          : "This CV does not contain enough readable summary, skills, or experience details to assign recommended roles automatically."}
      </p>
      <p className="mt-3 text-sm">
        Type your own target role above, for example <span className="font-semibold">HR</span>, <span className="font-semibold">Mechanical Engineer</span>, or <span className="font-semibold">QA Engineer</span>, and we will generate the role-fit breakdown for that role.
      </p>
    </div>
  );
}
