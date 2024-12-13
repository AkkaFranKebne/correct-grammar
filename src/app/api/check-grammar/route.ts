import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

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
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
