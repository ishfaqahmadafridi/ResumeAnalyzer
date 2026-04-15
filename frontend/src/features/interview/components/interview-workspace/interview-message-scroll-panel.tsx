"use client";

import { useCallback } from "react";
import { InterviewMessageList } from "./interview-message-list";
import { scrollContainerToBottom } from "@/features/utils/interview/scroll-utils";
import type { Message } from "@/features/types/interview/workspace";

interface Props {
  messages: Message[];
}

export function InterviewMessageScrollPanel({ messages }: Props) {
  const setScrollAnchorRef = useCallback((node: HTMLDivElement | null) => {
    if (!node || !node.parentElement) {
      return;
    }
    scrollContainerToBottom(node.parentElement);
  }, []);

  return (
    <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
      <InterviewMessageList messages={messages} />
      <div key={`scroll-anchor-${messages.length}`} ref={setScrollAnchorRef} />
    </div>
  );
}
