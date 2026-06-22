"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface Chat {
  name: string;
  messages: any[];
}

interface ChatContextProps {
  chats: { [key: string]: Chat };
  setChats: React.Dispatch<React.SetStateAction<{ [key: string]: Chat }>>;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  // Always start empty so server and client initial render match (avoids hydration mismatch).
  // Load from localStorage only after mount.
  const [chats, setChats] = useState<{ [key: string]: Chat }>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("chats");
    if (stored) {
      setChats(JSON.parse(stored));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("chats", JSON.stringify(chats));
    }
  }, [chats, hydrated]);

  return (
    <ChatContext.Provider value={{ chats, setChats }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
