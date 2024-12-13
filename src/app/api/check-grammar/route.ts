import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { text } = await req.json();

  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that corrects grammar and orthography. Provide the corrected text only, without any explanations.",
      },
      {
        role: "user",
        content: `Please correct the grammar and orthography in the following text: "${text}"`,
      },
    ],
  });

  return result.toDataStreamResponse();
}
