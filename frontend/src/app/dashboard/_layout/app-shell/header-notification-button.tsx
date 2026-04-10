import Link from "next/link";
import { Bell } from "lucide-react";
import { useNotificationStore } from "@/store/notification-store";

export function HeaderNotificationButton() {
  const { notifications, markAsRead } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Link
      href="/dashboard/notifications"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-stone-600 transition hover:bg-stone-50 hover:text-stone-950"
      aria-label="Notifications"
      title="Notifications"
      onClick={markAsRead}
    >
      <Bell className="h-4 w-4" />
      {unreadCount > 0 && (
        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
      )}
    </Link>
  );
}
