export function WorkspaceStructuredDetails({ structured }: { structured: any }) {
  const education = structured?.education ?? [];
  const languages = structured?.languages ?? [];

  return (
    <div className="space-y-2">
      <p className="text-sm"><span className="font-semibold">Name:</span> {structured?.name || "Unknown"}</p>
      <p className="text-sm"><span className="font-semibold">Email:</span> {structured?.email || "Unknown"}</p>
      <p className="text-sm"><span className="font-semibold">Phone:</span> {structured?.phone || "Unknown"}</p>
      <p className="text-sm"><span className="font-semibold">Summary:</span> {structured?.summary || "No summary extracted"}</p>

      <p className="text-sm"><span className="font-semibold">Languages:</span> {languages.length ? languages.join(", ") : "Not extracted"}</p>
      <p className="text-sm"><span className="font-semibold">Education:</span> {education.length ? education[0] : "Not extracted"}</p>
    </div>
  );
}
