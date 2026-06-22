"use client";

import ModelSelector from "@/components/ModelSelector";
import Prompt from "@/components/Prompt";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { DEFAULT_MODEL_ID } from "@/lib/models";
import { Message } from "ai";
import { useChat } from "ai/react";
import { Bot } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { useChatContext } from "../context/ChatContext";

interface ChatPageProps {
  id: string;
  initialMessages: Message[];
}

const MarkdownContent = ({ content }: { content: string }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      code({ node, inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || "");
        return !inline && match ? (
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            customStyle={{ borderRadius: "0.5rem", margin: "0.5rem 0", fontSize: "0.8rem" }}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        ) : (
          <code
            className="bg-gray-900 text-violet-300 px-1.5 py-0.5 rounded text-[0.82em] font-mono"
            {...props}
          >
            {children}
          </code>
        );
      },
      table({ children }: any) {
        return (
          <div className="overflow-x-auto my-4 rounded-lg border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              {children}
            </table>
          </div>
        );
      },
      thead({ children }: any) {
        return <thead className="bg-gray-800/70">{children}</thead>;
      },
      th({ children }: any) {
        return (
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
            {children}
          </th>
        );
      },
      td({ children }: any) {
        return (
          <td className="px-4 py-3 text-sm text-gray-300 border-t border-gray-700/60">
            {children}
          </td>
        );
      },
      tr({ children }: any) {
        return (
          <tr className="even:bg-gray-800/20 hover:bg-gray-800/40 transition-colors">
            {children}
          </tr>
        );
      },
      p({ children }: any) {
        return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
      },
      ul({ children }: any) {
        return <ul className="list-disc mb-3 space-y-1 pl-5">{children}</ul>;
      },
      ol({ children }: any) {
        return <ol className="list-decimal mb-3 space-y-1 pl-5">{children}</ol>;
      },
      li({ children }: any) {
        return <li className="text-gray-200 leading-relaxed">{children}</li>;
      },
      h1({ children }: any) {
        return (
          <h1 className="text-2xl font-bold mb-3 mt-5 text-white border-b border-gray-700 pb-2">
            {children}
          </h1>
        );
      },
      h2({ children }: any) {
        return (
          <h2 className="text-xl font-bold mb-2 mt-4 text-white">{children}</h2>
        );
      },
      h3({ children }: any) {
        return (
          <h3 className="text-lg font-semibold mb-2 mt-3 text-white">
            {children}
          </h3>
        );
      },
      blockquote({ children }: any) {
        return (
          <blockquote className="border-l-4 border-violet-500 pl-4 my-3 text-gray-400 italic bg-violet-500/5 py-2 rounded-r-md">
            {children}
          </blockquote>
        );
      },
      a({ href, children }: any) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
          >
            {children}
          </a>
        );
      },
      hr() {
        return <hr className="border-gray-700 my-4" />;
      },
      strong({ children }: any) {
        return (
          <strong className="font-semibold text-white">{children}</strong>
        );
      },
      em({ children }: any) {
        return <em className="text-gray-300 italic">{children}</em>;
      },
    }}
  >
    {content}
  </ReactMarkdown>
);

const ChatPage = ({ id, initialMessages }: ChatPageProps) => {
  const { setChats } = useChatContext();

  // Model selection — start with default to avoid SSR mismatch, hydrate from localStorage after mount
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL_ID);
  useEffect(() => {
    const saved = localStorage.getItem("selectedModel");
    if (saved) setSelectedModel(saved);
  }, []);

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem("selectedModel", modelId);
  };

  const [apiError, setApiError] = useState<string | null>(null);

  const { messages, setMessages, handleSubmit, input, isLoading, stop, handleInputChange } =
    useChat({
      id,
      body: { id, model: selectedModel },
      initialMessages,
      onError: async (err) => {
        try {
          const body = await (err as any).response?.json?.();
          setApiError(body?.error ?? err.message ?? "Something went wrong.");
        } catch {
          setApiError(err.message ?? "Something went wrong.");
        }
      },
      onResponse: () => setApiError(null),
    });

  // Load saved messages from localStorage after mount (avoids SSR/client hydration mismatch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("chats");
      if (stored) {
        const parsed = JSON.parse(stored);
        const saved: Message[] = parsed[id]?.messages;
        if (saved?.length > 0) {
          setMessages(saved);
        }
      }
    } catch {
      // ignore parse errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const { bottomRef } = useAutoScroll(messages);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // Sync to localStorage when streaming finishes or a user message is added
  useEffect(() => {
    if (!isLoading && messagesRef.current.length > 0) {
      const msgs = messagesRef.current;
      const firstUser = msgs.find((m) => m.role === "user");
      setChats((prev) => ({
        ...prev,
        [id]: {
          name:
            prev[id]?.name ||
            firstUser?.content?.slice(0, 50) ||
            "New Chat",
          messages: msgs,
        },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleSubmit(e);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top bar with model selector */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800/60 flex-shrink-0">
        <ModelSelector selectedModelId={selectedModel} onSelect={handleModelChange} />
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hidden">
        <div className="max-w-3xl mx-auto">
          {/* Empty state */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center pt-20 pb-8 text-center select-none">
              <div className="w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-5">
                <Bot className="w-8 h-8 text-violet-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                How can I help you?
              </h2>
              <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                Ask me anything — I can answer questions, write code, explain
                concepts, and present data in tables.
              </p>
            </div>
          )}

          {/* Message list */}
          <div className="space-y-6">
            {messages.map((message, i) => {
              const isStreaming =
                isLoading &&
                i === messages.length - 1 &&
                message.role === "assistant";

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex-shrink-0 flex items-center justify-center mt-1">
                      <Bot className="w-4 h-4 text-violet-400" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-violet-600 text-white rounded-br-none max-w-[80%]"
                        : "bg-[#1a1730] text-gray-200 rounded-bl-none border border-gray-700/50 max-w-[85%] w-full"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div className={isStreaming ? "streaming-cursor" : ""}>
                        <MarkdownContent content={message.content} />
                      </div>
                    ) : (
                      <span className="whitespace-pre-wrap">
                        {message.content}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator — shown before first streaming token arrives */}
            {isLoading &&
              messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex-shrink-0 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className="bg-[#1a1730] border border-gray-700/50 rounded-2xl rounded-bl-none px-4 py-3">
                    <div className="flex gap-1.5 items-center h-5">
                      <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
          </div>

          <div ref={bottomRef} className="h-2" />
        </div>
      </div>

      {/* Error banner */}
      {apiError && (
        <div className="mx-4 mb-2 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <span className="mt-0.5 flex-shrink-0">⚠</span>
          <span className="flex-1">{apiError}</span>
          <button
            onClick={() => setApiError(null)}
            className="flex-shrink-0 text-red-500 hover:text-red-300 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* Input */}
      <Prompt
        input={input}
        isLoading={isLoading}
        handleSubmit={onSubmit}
        stop={stop}
        handleInputChange={(e) =>
          handleInputChange(
            e as unknown as React.ChangeEvent<HTMLInputElement>
          )
        }
      />
    </div>
  );
};

export default ChatPage;
