import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const idea =
      typeof body.idea === "string" ? body.idea.trim() : "";

    const type =
      typeof body.type === "string" && body.type.trim()
        ? body.type.trim()
        : "Blog post";

    if (!idea) {
      return NextResponse.json(
        { error: "Please provide a content idea." },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("OPENAI_API_KEY is missing");

      return NextResponse.json(
        { error: "AI provider is not configured." },
        { status: 500 },
      );
    }
    let formatInstruction =
  "Write clear, useful and engaging content.";

if (type.toLowerCase() === "social post") {
  formatInstruction =
    "Write a concise, engaging social media post with a strong opening and natural call to action.";
}

if (type.toLowerCase() === "video script") {
  formatInstruction =
    "Write a short video script with a strong hook, clear narration, and an engaging ending.";
}

if (type.toLowerCase() === "blog post") {
  formatInstruction =
    "Write a polished blog post with a compelling introduction, useful sections, and a strong conclusion.";
}
   const openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "SparkWriter",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
{
  role: "system",
  content: `You are SparkWriter, a professional AI writing assistant.

${formatInstruction}

Return only the requested content.`,
},
            {
              role: "user",
              content: `Create a ${type} about this idea:

${idea}`,
            },
          ],
          max_tokens: 10,
          temperature: 0.7,
        }),
      },
    );

    const data = await openRouterResponse.json();

    if (!openRouterResponse.ok) {
      console.error(
        "OpenRouter error:",
        openRouterResponse.status,
        data,
      );

      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "OpenRouter rejected the request.",
        },
        { status: openRouterResponse.status },
      );
    }

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      console.error("OpenRouter returned no content:", data);

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
