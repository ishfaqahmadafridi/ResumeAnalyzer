import {
  BriefcaseBusiness,
  FileClock,
  FileText,
  LayoutDashboard,
  MessageSquareQuote,
} from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/cv", label: "CV Analysis", icon: FileText },
  { href: "/dashboard/cv-history", label: "CV History", icon: FileClock },
  { href: "/dashboard/interview", label: "Interview", icon: MessageSquareQuote },
  { href: "/dashboard/jobs", label: "Auto Apply", icon: BriefcaseBusiness },
];
