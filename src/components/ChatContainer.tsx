"use client";

import ChatList from "@/components/ChatList";
import Chat from "@/components/ChatPage";
import { useState } from "react";

interface ChatContainerProps {
  id: string;
}

export default function ChatContainer({ id }: ChatContainerProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] bg-[#0d0c14] overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#13111f] border-r border-gray-800/60 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:flex-shrink-0`}
      >
        <ChatList />
      </aside>

      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content — relative so ChatPage can use absolute inset-0 */}
      <main className="flex-1 min-w-0 relative overflow-hidden">
        <Chat
          id={id}
          initialMessages={[]}
          onOpenSidebar={() => setSidebarOpen((o) => !o)}
        />
      </main>
    </div>
  );
}
