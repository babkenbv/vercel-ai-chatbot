import type { Message } from "ai";
import { useEffect, useRef } from "react";

export const useAutoScroll = (messages: Message[] = []) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastContent = messages[messages.length - 1]?.content;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, lastContent]);

  return { bottomRef };
};
