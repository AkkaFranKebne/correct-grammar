import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
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
          content: `Please correct the grammar and orthography in the following text, provide the corrected text only, without any explanations: "${prompt}"`,
        },
      ],
    });
    //@ts-expect-error  temporary fix
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
