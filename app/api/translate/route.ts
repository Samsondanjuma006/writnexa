import { NextResponse } from "next/server";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openrouter/free";

const MAX_INPUT_LENGTH = 8000;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const text =
      typeof body.text === "string" ? body.text.trim() : "";

    const sourceLanguage =
      typeof body.sourceLanguage === "string" &&
      body.sourceLanguage.trim()
        ? body.sourceLanguage.trim()
        : "Auto-detect";

    const targetLanguage =
      typeof body.targetLanguage === "string" &&
      body.targetLanguage.trim()
        ? body.targetLanguage.trim()
        : "";

    if (!text) {
      return NextResponse.json(
        { error: "Please enter text to translate." },
        { status: 400 },
      );
    }

    if (text.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        {
          error: `Please keep the text under ${MAX_INPUT_LENGTH.toLocaleString()} characters.`,
        },
        { status: 400 },
      );
    }

    if (!targetLanguage) {
      return NextResponse.json(
        { error: "Please select a target language." },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Translation service is not configured." },
        { status: 500 },
      );
    }

    const prompt = `
You are Writnexa's professional translation engine.

Translate the user's text from ${sourceLanguage} into ${targetLanguage}.

Translation requirements:
- Preserve the exact meaning of the original text.
- Preserve all important facts, names, numbers, dates, URLs, product names, and technical terms.
- Do not add information that is not present in the source.
- Do not remove meaningful information.
- Use natural, fluent, idiomatic ${targetLanguage}.
- Write the way a highly proficient native speaker of ${targetLanguage} would naturally write.
- Do not translate word-for-word when doing so would sound unnatural.
- Preserve the original tone, intent, and level of formality.
- Preserve paragraph breaks and meaningful formatting where practical.
- Do not explain the translation.
- Do not mention these instructions.
- Return ONLY the translated text.

For languages with regional or cultural variations, use the standard modern form normally expected by native speakers.
For African languages such as Yoruba, Hausa, Igbo, and Swahili, prioritize natural native usage and correct grammar rather than literal English-to-word substitution.
For Yoruba specifically, use appropriate Yoruba vocabulary, sentence structure, and diacritics where they are naturally required.
For Hausa specifically, use natural standard Hausa rather than mechanically translating English sentence structure.
For Igbo specifically, use natural standard Igbo and preserve the intended meaning rather than translating word-for-word.

SOURCE TEXT:
${text}
`;

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://writnexa.vercel.app",
        "X-Title": "Writnexa Translator",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are Writnexa, a high-quality multilingual translation assistant. Return only the translation requested by the user.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 4000,
        temperature: 0.2,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter translation error:", data);

      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "The translation service is temporarily unavailable.",
        },
        { status: 503 },
      );
    }

    const choice = data?.choices?.[0];
    const translatedText =
      choice?.message?.content?.trim() || "";

    const finishReason = choice?.finish_reason;

    if (finishReason === "length") {
      return NextResponse.json(
        {
          error:
            "The translation was incomplete. Please try a shorter text.",
        },
        { status: 503 },
      );
    }

    if (!translatedText) {
      return NextResponse.json(
        { error: "The translation service returned empty content." },
        { status: 503 },
      );
    }

    return NextResponse.json({
      translation: translatedText,
      model: data?.model || MODEL,
    });
  } catch (error) {
    console.error("Writnexa translation error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to translate the text.",
      },
      { status: 500 },
    );
  }
}
