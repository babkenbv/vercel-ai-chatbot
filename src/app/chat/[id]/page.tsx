import ChatContainer from "@/components/ChatContainer";
import { ChatProvider } from "@/context/ChatContext";

export default async function Container({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <ChatProvider>
      <ChatContainer id={id} />
    </ChatProvider>
  );
}
