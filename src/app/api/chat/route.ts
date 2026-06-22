import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText, type Message } from "ai";

function getModel(modelId: string) {
  switch (modelId) {
    case "gpt-5.5":
      return openai("gpt-5.5");
    case "gemini-2.5-flash":
    default:
      return google("gemini-2.5-flash");
  }
}

export async function POST(request: Request) {
  try {
    const {
      messages,
      model: modelId = "gemini-2.5-flash",
    }: { id: string; messages: Array<Message>; model?: string } =
      await request.json();

    const coreMessages = convertToCoreMessages(messages).filter(
      (message) => message.content.length > 0
    );

    const result = await streamText({
      model: getModel(modelId),
      system:
        "You are a helpful AI assistant. When a user asks for data, equations, or properties, render them as well-formatted markdown tables or code blocks with language identifiers. Use proper markdown for all responses.",
      messages: coreMessages,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("[/api/chat] Error:", error?.message ?? error);
    return new Response(
      JSON.stringify({ error: error?.message ?? "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
