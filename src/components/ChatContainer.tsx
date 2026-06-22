"use client";

import ChatList from "@/components/ChatList";
import Chat from "@/components/ChatPage";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface ChatContainerProps {
  id: string;
}

export default function ChatContainer({ id }: ChatContainerProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0d0c14] overflow-hidden">
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

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex md:hidden items-center px-4 py-3 border-b border-gray-800/60 bg-[#13111f] flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <span className="ml-3 text-sm font-semibold text-gray-200 tracking-wide">
            AI Chatbot
          </span>
        </header>

        <div className="flex-1 overflow-hidden">
          <Chat id={id} initialMessages={[]} />
        </div>
      </main>
    </div>
  );
}
