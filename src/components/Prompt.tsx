"use client";

import { Send, Square } from "lucide-react";
import { useEffect, useRef } from "react";

interface PromptProps {
  input: string;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  stop: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Prompt = ({
  input,
  isLoading,
  handleSubmit,
  stop,
  handleInputChange,
}: PromptProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  return (
    <div className="px-3 md:px-4 pb-3 md:pb-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-[#1e1b2e] border border-gray-700/60 rounded-2xl flex items-end gap-2 px-3 md:px-4 py-2 md:py-3 shadow-lg shadow-black/40 focus-within:border-violet-500/50 transition-colors duration-200"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything…"
          rows={1}
          className="flex-1 bg-transparent text-[#ececec] placeholder-gray-600 text-sm resize-none outline-none leading-6 max-h-28 overflow-y-auto scrollbar-hidden py-0.5"
        />
        {isLoading ? (
          <button
            onClick={stop}
            type="button"
            title="Stop generating"
            className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-lg bg-violet-600/20 hover:bg-violet-600/40 text-violet-400 hover:text-violet-300 flex items-center justify-center transition-colors mb-0.5"
          >
            <Square fill="currentColor" strokeWidth={0} className="h-3 w-3" />
            <span className="sr-only">Stop</span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            title="Send"
            className={`flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center transition-all duration-150 mb-0.5 ${
              input.trim()
                ? "bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-900/40"
                : "bg-gray-800/60 text-gray-600 cursor-not-allowed"
            }`}
          >
            <Send className="h-3 w-3 md:h-3.5 md:w-3.5" />
            <span className="sr-only">Send</span>
          </button>
        )}
      </form>
      <p className="text-center text-gray-700 text-[11px] mt-1.5 select-none">
        AI can make mistakes. Check important information.
      </p>
    </div>
  );
};

export default Prompt;
