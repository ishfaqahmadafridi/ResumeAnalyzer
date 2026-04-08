export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000/api";

export const APP_NAME = "CVForge AI";

export const QUICK_ACTIONS = [
  { href: "/dashboard/cv", label: "Upload CV" },
  { href: "/dashboard/interview", label: "Practice Interview" },
  { href: "/dashboard/jobs", label: "Auto Apply Jobs" },
];
