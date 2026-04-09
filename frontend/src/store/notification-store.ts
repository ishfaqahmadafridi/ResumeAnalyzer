"use client";

import { create } from "zustand";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  threadId?: string;
  actionRequired?: "approval" | "input" | null;
  jobs?: Array<{
    title: string;
    company: string;
    location: string;
    url: string;
  }>;
  read: boolean;
  createdAt: Date;
}

type NotificationState = {
  notifications: AppNotification[];
  addNotification: (payload: { title: string; message: string; threadId?: string; actionRequired?: "approval" | "input" | null; jobs?: AppNotification["jobs"] }) => void;
  removeNotification: (id: string) => void;
  markAsRead: () => void;
  clearNotifications: () => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (payload) =>
    set((state) => ({
      notifications: [
        {
          id: Math.random().toString(36).substring(2, 9),
          title: payload.title,
          message: payload.message,
          threadId: payload.threadId,
          actionRequired: payload.actionRequired,
          jobs: payload.jobs,
          read: false,
          createdAt: new Date(),
        },
        ...state.notifications,
      ],
    })),
  removeNotification: (id: string) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  markAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));
