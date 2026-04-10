export function InterviewCvContextDisplay({ activeInterviewRole, latestAnalysis }: { activeInterviewRole: string | null, latestAnalysis: any | null }) {
  const matchedSkills = latestAnalysis?.analysis?.matched_skills?.slice(0, 4).join(", ") || "not available";
  
  return (
    <div>
      <p className="text-base font-semibold text-stone-950">CV context loaded</p>
      <p className="mt-2 text-sm leading-6 text-stone-600">
        {latestAnalysis?.analysis
          ? `The chatbot will interview you for your "${activeInterviewRole}" role. Current strengths: ${matchedSkills}`
          : "Upload and analyze a CV so the interview prompt can be grounded in your real profile."}
      </p>
    </div>
  );
}
