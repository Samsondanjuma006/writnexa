import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "SparkWriter",
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const idea = typeof body.idea === "string" ? body.idea.trim() : "";
    const type = typeof body.type === "string" ? body.type : "Blog post";

    if (!idea) {
      return NextResponse.json(
        { error: "Please provide a content idea." },
        { status: 400 },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "AI provider is not configured." },
        { status: 500 },
      );
    }

    const response = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are SparkWriter, a professional AI writing assistant for bloggers, creators, marketers, and businesses. Create useful, original, clear, engaging content. Do not add unnecessary introductions or explanations.",
        },
        {
          role: "user",
          content: `Create a ${type} about this idea:

${idea}

Return polished, publication-ready content.`,
        },
      ],
      max_tokens: 1200,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "The AI returned an empty response." },
        { status: 502 },
      );
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error("SparkWriter generation error:", error);

    return NextResponse.json(
      { error: "Unable to generate content right now." },
      { status: 500 },
    );
  }
}
