"use client";

import { useNotificationStore } from "@/store/notification-store";
import { Bell, Trash2, Mail, ExternalLink, ChevronDown, ChevronUp, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAppSelector } from "@/store";

function formatRelativeTime(date: Date) {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const daysDifference = Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  if (daysDifference === 0) {
    const hours = Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.round((date.getTime() - Date.now()) / (1000 * 60));
      return rtf.format(minutes, "minute");
    }
    return rtf.format(hours, "hour");
  }
  return rtf.format(daysDifference, "day");
}

export default function NotificationsPage() {
  const { notifications, clearNotifications, markAsRead, removeNotification, addNotification } = useNotificationStore();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    markAsRead();
  }, [markAsRead]);

  const handleAction = async (notificationId: string, threadId: string | undefined, actionType: "approve" | "reject" | "answer") => {
    if (!token || !user || !threadId) return;
    
    setIsLoading(prev => ({ ...prev, [notificationId]: true }));
    try {
      if (actionType === "reject") {
        removeNotification(notificationId);
        toast.info("Auto-apply cancelled");
        return;
      }

      const answer = inputs[notificationId];
      const apiAction = actionType === "approve" ? "approve_applications" : "answer_question";
      
      const res = await api.orchestrate(token, {
        user_id: user.id,
        cv_text: "",
        action: apiAction,
        thread_id: threadId,
        action_data: answer ? { answer } : {},
      });

      let newJobs: any[] = [];
      const notification = notifications.find((n: any) => n.id === notificationId);
      if (notification && notification.jobs) {
        newJobs = notification.jobs;
      }

      removeNotification(notificationId);

      if ((res as any).action_data?.needs_info) {
        addNotification({
          title: "Setup Incomplete: More Details Required",
          message: res.notifications?.[res.notifications.length - 1] || "The exact questions were not returned from the agent. Please provide input.",
          threadId: threadId,
          actionRequired: "input",
          jobs: newJobs
        });
      } else {
        addNotification({
          title: "Application Complete",
          message: res.notifications?.[0] || "We successfully completed the background job applications for you.",
          jobs: newJobs
        });
        toast.success("Job applied successfully");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to communicate with agent");
    } finally {
      setIsLoading(prev => ({ ...prev, [notificationId]: false }));
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between rounded-[28px] border border-black/10 bg-white/84 p-6 shadow-[var(--shadow)] backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Notifications</h2>
          <p className="mt-1 text-sm text-stone-500">
            View updates from your agents and active workflows.
          </p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[28px] border border-black/10 bg-white/50 py-20 text-center shadow-sm">
            <Bell className="mb-4 h-10 w-10 text-stone-300" />
            <h3 className="text-lg font-semibold text-stone-900">No notifications</h3>
            <p className="text-stone-500">You&apos;re all caught up!</p>
          </div>
        ) : (
          notifications.map((n) => {
            const isExpanded = expandedIds.has(n.id);
            return (
              <div
                key={n.id}
                className={cn(
                  "flex flex-col gap-2 rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:border-black/20 cursor-pointer overflow-hidden",
                  isExpanded ? "ring-2 ring-stone-900 border-transparent shadow-md" : ""
                )}
                onClick={() => toggleExpand(n.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                        {n.title || "Agent Update"}
                      </span>
                      <p className="max-w-[calc(100vw-120px)] truncate text-sm font-semibold text-stone-900 group-hover:text-emerald-700">
                        {n.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-xs font-medium text-stone-500 whitespace-nowrap text-right">
                      {formatRelativeTime(new Date(n.createdAt))}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-stone-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-stone-400" />
                    )}
                  </div>
                </div>

                <div 
                  className={cn(
                    "grid transition-all duration-300 text-stone-800",
                    isExpanded ? "grid-rows-[1fr] opacity-100 pt-4 mt-2 border-t border-black/5" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium leading-relaxed text-stone-600 mb-6">
                      Following your request, your personal agent searched across the platforms provided. Here are the job opportunities that match your uploaded CV profile and settings.
                    </p>

                    {n.jobs && n.jobs.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {n.jobs.map((job, idx) => (
                          <div 
                            key={idx} 
                            className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4 transition-colors hover:border-black/20 hover:bg-stone-100/50 sm:flex-row sm:items-center sm:justify-between"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex flex-col">
                              <h4 className="text-base font-semibold leading-tight text-stone-900">
                                {job.title}
                              </h4>
                              <p className="text-sm font-medium text-stone-600">
                                {job.company} &bull; {job.location}
                              </p>
                            </div>
                            <a
                              href={job.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800 sm:w-auto"
                            >
                              View Position
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      !n.actionRequired && (
                        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50/50 px-6 py-8 text-left">
                          <h4 className="flex items-center gap-2 text-sm font-semibold text-stone-900 mb-3">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Agent Activity Log
                          </h4>
                          <ul className="space-y-3 text-sm font-medium text-stone-600 font-mono">
                            <li className="flex gap-2">
                              <span className="text-stone-400">[1]</span> 
                              <span>Connecting to selected platforms... LinkedIn, Indeed, GitHub.</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="text-stone-400">[2]</span> 
                              <span>Analyzing CV profile: Frontend Developer, React, HTML, CSS.</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="text-stone-400">[3]</span> 
                              <span>Matching keywords and filtering by postings within the last 1 week...</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="text-stone-400">[4]</span> 
                              <span className="font-semibold text-rose-500">No jobs related to this role were found in the last 1 week.</span>
                            </li>
                          </ul>
                          <p className="mt-4 text-xs text-stone-500 italic">Recommendation: Try adjusting the selected platforms or adding more skills to your CV to widen the search pool.</p>
                        </div>
                      )
                    )}

                    {n.actionRequired === "approval" && (
                      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-5" onClick={e => e.stopPropagation()}>
                        <p className="text-sm font-medium text-blue-900">
                          Would you like me to auto-apply to these recommended positions using your uploaded CV?
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => handleAction(n.id, n.threadId, "approve")}
                            disabled={isLoading[n.id]}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Yes, auto-apply
                          </button>
                          <button
                            onClick={() => handleAction(n.id, n.threadId, "reject")}
                            disabled={isLoading[n.id]}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                          >
                            <XCircle className="h-4 w-4" />
                            No, skip
                          </button>
                        </div>
                      </div>
                    )}

                    {n.actionRequired === "input" && (
                      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-amber-100 bg-amber-50/50 p-5" onClick={e => e.stopPropagation()}>
                        <p className="text-sm font-medium text-amber-900">
                          {n.message}
                        </p>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2">
                          <input 
                            value={inputs[n.id] || ""}
                            onChange={(e) => setInputs(prev => ({...prev, [n.id]: e.target.value}))}
                            placeholder="Type your missing information here..."
                            className="flex-1 rounded-xl border border-amber-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                          />
                          <button
                            onClick={() => handleAction(n.id, n.threadId, "answer")}
                            disabled={isLoading[n.id] || !inputs[n.id]}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
                          >
                            Continue Application
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
