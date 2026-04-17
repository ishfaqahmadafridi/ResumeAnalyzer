import {
  BriefcaseBusiness,
  FileClock,
  FilePenLine,
  FileText,
  LayoutDashboard,
  MessageSquareQuote,
} from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/cv", label: "CV Analysis", icon: FileText },
  { href: "/dashboard/update-cv", label: "Update CV", icon: FilePenLine },
  { href: "/dashboard/cv-history", label: "CV History", icon: FileClock },
  { href: "/dashboard/interview", label: "Interview", icon: MessageSquareQuote },
  { href: "/dashboard/jobs", label: "Auto Apply", icon: BriefcaseBusiness },
];

export const pageMeta: Record<string, { eyebrow: string; title: string }> = {
  "/dashboard": { eyebrow: "Career workspace", title: "Track your CV activity and hiring progress" },
  "/dashboard/cv": { eyebrow: "CV analysis", title: "Upload, compare, and improve every CV version" },
  "/dashboard/update-cv": { eyebrow: "Update CV", title: "Edit each section, apply AI suggestions, and compare changes" },
  "/dashboard/cv-history": { eyebrow: "CV history", title: "Review older uploads and reopen saved resume versions" },
  "/dashboard/interview": { eyebrow: "Interview prep", title: "Practice role-specific questions from your latest profile" },
  "/dashboard/jobs": { eyebrow: "Auto apply", title: "Manage platform links and launch your application flow" },
  "/dashboard/profile": { eyebrow: "Account settings", title: "Manage your profile, photo, and security details" },
};
