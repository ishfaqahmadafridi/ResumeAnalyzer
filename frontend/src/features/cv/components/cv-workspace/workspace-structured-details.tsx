export function WorkspaceStructuredDetails({ structured }: { structured: any }) {
  return (
    <div className="space-y-2">
      <p className="text-sm"><span className="font-semibold">Name:</span> {structured?.name || "Unknown"}</p>
      <p className="text-sm"><span className="font-semibold">Email:</span> {structured?.email || "Unknown"}</p>
      <p className="text-sm"><span className="font-semibold">Phone:</span> {structured?.phone || "Unknown"}</p>
      <p className="text-sm"><span className="font-semibold">Summary:</span> {structured?.summary || "No summary extracted"}</p>
    </div>
  );
}
