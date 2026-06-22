"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, SquarePen } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useChatContext } from "../context/ChatContext";

const ChatList = () => {
  const { chats } = useChatContext();
  const pathname = usePathname();

  const handleNewChat = () => {
    window.location.assign(`/chat/${uuidv4()}`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sidebar header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800/60 flex-shrink-0">
        <span className="text-sm font-semibold text-white tracking-wide">
          AI Chatbot
        </span>
        <button
          onClick={handleNewChat}
          title="New conversation"
          className="p-1.5 rounded-lg hover:bg-gray-700/60 text-gray-400 hover:text-white transition-colors"
        >
          <SquarePen className="h-4 w-4" />
        </button>
      </div>

      {/* Chat history */}
      <div className="flex-1 overflow-y-auto scrollbar-hidden py-2 px-2">
        {Object.keys(chats).length === 0 ? (
          <p className="text-gray-600 text-xs text-center mt-8 px-4 leading-relaxed">
            No conversations yet.
            <br />
            Start a new chat below!
          </p>
        ) : (
          <nav className="space-y-0.5">
            {Object.keys(chats)
              .reverse()
              .map((key) => {
                const isActive = pathname === `/chat/${key}`;
                const name = chats[key]?.name || "New Chat";
                const truncated =
                  name.length > 26 ? name.slice(0, 26) + "…" : name;
                return (
                  <Link
                    key={key}
                    href={`/chat/${key}`}
                    title={name}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-violet-600/20 text-white border border-violet-500/25"
                        : "text-gray-400 hover:bg-gray-800/60 hover:text-gray-200"
                    }`}
                  >
                    <MessageSquare
                      className={`h-3.5 w-3.5 flex-shrink-0 ${
                        isActive ? "text-violet-400" : "opacity-50"
                      }`}
                    />
                    <span className="truncate">{truncated}</span>
                  </Link>
                );
              })}
          </nav>
        )}
      </div>

      {/* New chat button */}
      <div className="px-3 py-3 border-t border-gray-800/60 flex-shrink-0">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-violet-600/15 hover:bg-violet-600/25 text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors border border-violet-500/20"
        >
          <SquarePen className="h-4 w-4" />
          New conversation
        </button>
      </div>
    </div>
  );
};

export default ChatList;
