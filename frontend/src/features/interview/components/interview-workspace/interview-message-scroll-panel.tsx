"use client";

import { useCallback, useRef } from "react";
import { InterviewMessageList } from "./interview-message-list";
import { scrollContainerToBottom } from "@/features/utils/interview/scroll";
import type { Message } from "@/features/types/interview/workspace";

interface Props {
  messages: Message[];
}

export function InterviewMessageScrollPanel({ messages }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const setContainerRef = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;
  }, []);

  const setScrollAnchorRef = useCallback((node: HTMLDivElement | null) => {
    if (!node || !containerRef.current) {
      return;
    }
    scrollContainerToBottom(containerRef.current);
  }, []);

  return (
    <div ref={setContainerRef} className="max-h-96 space-y-3 overflow-y-auto pr-1">
      <InterviewMessageList messages={messages} />
      <div key={`scroll-anchor-${messages.length}`} ref={setScrollAnchorRef} />
    </div>
  );
}
