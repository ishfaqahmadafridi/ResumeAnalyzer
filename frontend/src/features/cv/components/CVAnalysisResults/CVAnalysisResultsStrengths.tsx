import { CheckCircle2 } from "lucide-react";
import { SkillBadgeList } from "@/components/ui/skill-badge-list";
import { Badge } from "@/components/ui/badge";

export function CVAnalysisResultsStrengths({
  strengths = [],
  roleName = "Selected Role",
  cvSkills = [],
  isLoading = false,
}: {
  strengths?: string[];
  roleName?: string;
  cvSkills?: string[];
  isLoading?: boolean;
}) {
  if (isLoading) return null;

  if (strengths.length === 0) {
    return (
      <div>
        <h4 className="flex items-center text-sm font-semibold mb-3 text-emerald-500">
          <CheckCircle2 className="w-4 h-4 mr-2" /> Skills found in your CV
        </h4>
        <p className="text-xs text-muted-foreground mb-3">Role to apply: {roleName}</p>
        <div className="flex flex-wrap gap-2">
          {(cvSkills || []).length > 0 ? (
            cvSkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 px-3 py-1 text-xs"
              >
                {skill}
              </Badge>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">We could not detect role-aligned strengths from this CV yet.</p>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <SkillBadgeList 
      skills={strengths} 
      icon={CheckCircle2} 
      label="Skills found in your CV" 
      variant="success" 
      emptyMessage="We could not detect role-aligned strengths from this CV yet."
    />
  );
}
