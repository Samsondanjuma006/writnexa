import { NextResponse } from "next/server";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

const MODEL = "gemini-3.6-flash";
const MAX_INPUT_LENGTH = 8000;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const text =
      typeof body.text === "string"
        ? body.text.trim()
        : "";

    const sourceLanguage =
      typeof body.sourceLanguage === "string" &&
      body.sourceLanguage.trim()
        ? body.sourceLanguage.trim()
        : "Auto-detect";

    const targetLanguage =
      typeof body.targetLanguage === "string" &&
      body.targetLanguage.trim()
        ? body.targetLanguage.trim()
        : "English";

    if (!text) {
      return NextResponse.json(
        { error: "Please enter text to translate." },
        { status: 400 }
      );
    }

    if (text.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        {
          error: `Text is too long. Please keep it under ${MAX_INPUT_LENGTH.toLocaleString()} characters.`,
        },
        { status: 400 }
      );
    }

    if (
      !targetLanguage ||
      targetLanguage.toLowerCase() === "auto-detect"
    ) {
      return NextResponse.json(
        { error: "Please select a target language." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is not configured.");

      return NextResponse.json(
        { error: "Translation service is not configured." },
        { status: 500 }
      );
    }

    const sourceInstruction =
      sourceLanguage.toLowerCase() === "auto-detect"
        ? "Automatically detect the source language."
        : `The source language is ${sourceLanguage}.`;

    const prompt = `You are Writnexa's professional translation engine.

Translate the user's text into ${targetLanguage}.

${sourceInstruction}

Translation requirements:
- Preserve the exact meaning, intent, facts, names, numbers, dates, URLs, product names, and technical terms.
- Do not add information, explanations, opinions, examples, or commentary.
- Do not omit meaningful information.
- Translate meaning and intent, not individual words.
- Use natural, fluent, idiomatic ${targetLanguage}.
- The result should sound like it was originally written by a well-educated native speaker of ${targetLanguage}.
- Do not copy English sentence structure when it produces unnatural target-language wording.
- Preserve the original tone, intent, audience, and level of formality.
- Preserve paragraphs, line breaks, and meaningful formatting where practical.
- Keep brand names, URLs, usernames, product names, and technical terms unchanged when there is no natural established translation.
- For Yoruba, Hausa, Igbo, and other African languages, use standard modern language and authentic contemporary usage. Do not invent vocabulary or use awkward literal translations.
- For Yoruba, use correct modern Yoruba grammar and diacritics where appropriate.
- For Hausa, use standard modern Hausa grammar and vocabulary.
- For Igbo, use standard modern Igbo grammar, vocabulary, and natural sentence structure.
- If a technical term has no natural established equivalent, retain the original technical term rather than inventing an unnatural translation.
- Silently review your translation before returning it for unnatural wording, literal calques, incorrect word choices, grammar problems, missing meaning, or inappropriate vocabulary.
- Return ONLY the translated text. Do not include explanations, labels, quotation marks, or commentary.

Text to translate:
${text}`;

    const response = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2000,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini translation error:", data);

      const message =
        data?.error?.message ||
        "The translation service could not complete the request.";

      return NextResponse.json(
        { error: message },
        { status: response.status >= 400 && response.status < 600 ? response.status : 502 }
      );
    }

    const translation =
      data?.candidates?.[0]?.content?.parts
        ?.filter(
          (part: unknown): part is { text: string } =>
            typeof part === "object" &&
            part !== null &&
            "text" in part &&
            typeof (part as { text?: unknown }).text === "string"
        )
        .map((part: { text: string }) => part.text)
        .join("")
        .trim() || "";

    if (!translation) {
      console.error("Gemini returned no translation:", data);

      return NextResponse.json(
        { error: "The translation service returned an empty result." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      translation,
      model: MODEL,
    });
  } catch (error) {
    console.error("Translation API error:", error);

    return NextResponse.json(
      { error: "Unable to translate the text right now. Please try again." },
      { status: 500 }
    );
  }
}
