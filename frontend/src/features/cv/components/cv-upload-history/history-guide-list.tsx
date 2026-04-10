import { Clock3, FileText, ScanText } from "lucide-react";
import { HistoryGuideItem } from "./history-guide-item";

const GUIDE_ITEMS = [
  { icon: FileText, title: "Review versions", detail: "Scan every upload in chronological order with score and extracted preview." },
  { icon: ScanText, title: "Reopen a draft", detail: "Select any saved CV to continue analysis from that exact version." },
  { icon: Clock3, title: "Track progress", detail: "Use the history to spot which uploads improved the role-fit score." },
];

export function HistoryGuideList() {
  return (
    <div className="mt-5 space-y-3">
      {GUIDE_ITEMS.map((item) => (
        <HistoryGuideItem key={item.title} icon={item.icon} title={item.title} detail={item.detail} />
      ))}
    </div>
  );
}
