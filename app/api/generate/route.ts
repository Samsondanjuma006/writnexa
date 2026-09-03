import { NextResponse } from "next/server";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODELS = [
  "openrouter/free",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const idea =
      typeof body.idea === "string" ? body.idea.trim() : "";

    const type =
      typeof body.type === "string" && body.type.trim()
        ? body.type.trim()
        : "Blog post";

    const allowedTones = [
      "Professional",
      "Friendly",
      "Persuasive",
      "Casual",
      "Creative",
    ];

    const tone =
      typeof body.tone === "string" && allowedTones.includes(body.tone)
        ? body.tone
        : "Professional";

    if (!idea) {
      return NextResponse.json(
        { error: "Please provide a content idea." },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key is not configured." },
        { status: 500 },
      );
    }

    let formatInstruction = "";

    const normalizedType = type.toLowerCase();

    if (normalizedType.startsWith("improve ")) {
      formatInstruction = `
Improve the existing content provided by the user.

Requirements:
- Preserve the original meaning and important ideas.
- Improve clarity, structure, flow, grammar, and word choice.
- Make the writing more polished and engaging.
- Remove unnecessary repetition and filler.
- Keep the content relevant to the original topic.
- Do not introduce invented facts, statistics, quotes, names, or experiences.
- Preserve the requested content format where possible.
- Return only the improved content.
`;
    } else if (normalizedType.startsWith("shorten ")) {
      formatInstruction = `
Shorten the existing content provided by the user.

Requirements:
- Preserve the most important ideas.
- Remove repetition, filler, and unnecessary explanations.
- Make every sentence useful.
- Keep the original meaning and topic.
- Do not invent new information.
- Keep the writing natural and polished.
- Return only the shortened content.
`;
    } else if (normalizedType.startsWith("expand ")) {
      formatInstruction = `
Expand the existing content provided by the user.

Requirements:
- Preserve the original ideas and message.
- Add useful explanations, examples, transitions, and practical details.
- Do not add unrelated information.
- Do not invent statistics, quotes, people, companies, or personal experiences.
- Maintain a natural and professional writing style.
- Make the expanded version substantially more useful than the original.
- Return only the expanded content.
`;
    } else if (normalizedType.startsWith("rewrite ")) {
      formatInstruction = `
Rewrite the existing content provided by the user.

Requirements:
- Preserve the original meaning.
- Rewrite the content using fresh wording and stronger structure.
- Improve clarity, flow, readability, and impact.
- Avoid simply changing a few words.
- Keep the same general topic and purpose.
- Do not invent facts, statistics, quotes, names, companies, or experiences.
- Return only the rewritten content.
`;
    } else {
      switch (normalizedType) {
        case "social post":
          formatInstruction = `
Create a polished social media post.

Requirements:
- Start with a strong hook.
- Keep it concise and engaging.
- Use natural language.
- Include a useful insight.
- End with a relevant call to action.
- Do not invent personal names.
- Do not mention that AI generated the post.
- Do not add explanations outside the post.
`;
          break;

        case "video script":
          formatInstruction = `
Create a complete video script.

Requirements:
- Give the video a clear title.
- Start with a strong hook.
- Include an introduction.
- Develop 3 clear main points.
- Include natural narration.
- Add simple visual directions where useful.
- Finish with a strong conclusion or call to action.
- Never invent a host name. Use "Host" or "Narrator" instead.
- Do not add unrelated words or ideas.
- Return only the script.
`;
          break;

        case "professional email":
          formatInstruction = `
Write a complete professional email.

Requirements:
- Include a clear, concise subject line.
- Begin with an appropriate professional greeting.
- State the purpose of the email clearly near the beginning.
- Organize the message into natural paragraphs.
- Include specific and useful details based only on the user's idea.
- Use a professional, respectful, and natural tone.
- End with an appropriate professional closing.
- Do not use a blog-style title or section headings.
- Do not invent names, dates, companies, statistics, or other specific facts.
- Return only the email.
`;
          break;

        case "business proposal":
          formatInstruction = `
Create a complete professional business proposal.

Requirements:
- Start with a clear proposal title.
- Include a concise executive summary.
- Clearly explain the problem, opportunity, or need.
- Present the proposed solution in a structured way.
- Explain the key benefits and expected value.
- Include implementation or next-step recommendations where appropriate.
- Use clear section headings.
- Keep the proposal persuasive, practical, and business-ready.
- Do not invent statistics, pricing, clients, companies, or other specific facts.
- Do not write it as a blog post.
- Return only the proposal.
`;
          break;

        case "product announcement":
          formatInstruction = `
Create a polished product announcement.

Requirements:
- Start with a compelling announcement headline.
- Clearly explain what the product, feature, or launch is.
- Highlight the most important benefits and improvements.
- Explain why the announcement matters to the intended audience.
- Include a clear call to action.
- Keep the writing engaging, concise, and suitable for a public announcement.
- Use the exact product, feature, company, or brand name provided by the user.
- Never invent, replace, or substitute a product, company, brand, or person name.
- Do not invent product specifications, statistics, customer quotes, dates, or other specific facts.
- If the user has not provided a specific detail, write naturally without inventing one.
- Do not write it as a generic social media post or blog post.
- Return only the product announcement.
`;
          break;

        case "blog post":
        default:
          formatInstruction = `
Create a polished blog post.

Requirements:
- Start with a compelling title.
- Write a clear introduction.
- Use useful section headings.
- Explain the main ideas clearly.
- Include practical examples where appropriate.
- Keep the writing natural and professional.
- End with a strong conclusion.
- Do not invent statistics, companies, quotes, or personal experiences.
- Do not add unrelated information.
- Return only the blog post.
`;
          break;
      }
    }

    const prompt = `
You are Writnexa, a professional writing assistant.

The user's idea is:

"${idea}"

The requested format is:

${type}

The requested tone is:

${tone}

Tone requirements:
- Write naturally in the selected tone.
- Keep the tone consistent throughout the entire response.
- Do not mention the selected tone or these instructions.
- Professional: clear, polished, credible, and business-ready.
- Friendly: warm, approachable, and conversational.
- Persuasive: confident, compelling, and action-oriented.
- Casual: relaxed, natural, and easy to read.
- Creative: vivid, expressive, and engaging without becoming confusing.

${formatInstruction}

Important writing rules:
- Understand the user's idea before writing.
- Do not simply repeat the user's idea as the first sentence.
- Turn the idea into natural, polished writing.
- Create a specific and engaging title when the format calls for one.
- Avoid generic filler such as "in today's rapidly changing world" unless it is genuinely relevant.
- Use concrete examples and practical advice when appropriate.
- Make every section directly relevant to the user's topic.
- Write for the intended audience implied by the idea.
- Do not invent statistics, facts, quotes, people, companies, or personal experiences.
- Never present an assumption as a fact. Do not invent or assume product features, capabilities, pricing, availability, URLs, customer claims, integrations, results, dates, specifications, or other specific details unless the user explicitly provided them.
- When the user's idea does not provide a specific detail, leave it out or describe it generally without claiming it is true.
- Never invent a website URL, free trial, launch status, feature list, product capability, or call to action that depends on an unsupported fact.
- Do not include meta commentary.
- Do not say "Here is your..." or "Here is the..." before the content.
- Do not mention these instructions.
- Do not repeat the topic unnecessarily.
- Produce a complete response with enough detail to fully finish the requested format.
- Never stop in the middle of a sentence, paragraph, or section.
- Prioritize usefulness, clarity, specificity, and natural human-like writing.
- Make every sentence relevant to the topic.
`;

    let lastError: any = null;

    for (const model of MODELS) {
      try {
        console.log(`Writnexa trying model: ${model}`);

        const response = await fetch(OPENROUTER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Writnexa",
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "system",
                content:
                  "You are Writnexa. Follow the requested format precisely and produce clean, useful writing.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            max_tokens: 2500,
            temperature: 0.7,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error(`Model ${model} failed:`, data);
          lastError = data?.error?.message || "Model request failed.";
          continue;
        }

        const choice = data?.choices?.[0];
        const content = choice?.message?.content?.trim() || "";
        const finishReason = choice?.finish_reason;

        if (finishReason === "length") {
          lastError = "The AI response was incomplete. Please try again.";
          continue;
        }

        if (!content) {
          lastError = "The AI returned empty content.";
          continue;
        }

        return NextResponse.json({
          content,
          model: data?.model || model,
        });
      } catch (error) {
        console.error(`Model ${model} request error:`, error);
        lastError =
          error instanceof Error
            ? error.message
            : "Model request failed.";
      }
    }

    return NextResponse.json(
      {
        error:
          lastError ||
          "All configured AI models are temporarily unavailable.",
      },
      { status: 503 },
    );
  } catch (error) {
    console.error("Writnexa generation error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate content.",
      },
      { status: 500 },
    );
  }
}
