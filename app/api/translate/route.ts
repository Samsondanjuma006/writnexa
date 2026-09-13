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
- Preserve the exact meaning, intent, facts, names, numbers, dates, URLs, product names, and technical terms in the source.
- Do not add information, explanations, opinions, examples, or assumptions that are not present in the source.
- Do not omit meaningful information.
- Translate meaning and intent, not individual words.
- Use natural, fluent, idiomatic language that a well-educated native speaker would actually use.
- Prefer established native vocabulary and natural sentence patterns over literal translations.
- Never force an English sentence structure onto the target language.
- If a literal translation sounds unnatural, rewrite it naturally while preserving the original meaning.
- Preserve the original tone, intent, audience, and level of formality.
- Preserve paragraph breaks and meaningful formatting where practical.
- Keep proper names, brand names, URLs, and technical terms unchanged unless there is a well-established target-language form.
- Return ONLY the translated text.

QUALITY STANDARD:
The translation should read as though it was originally written by a fluent native speaker of ${targetLanguage}, not as machine-translated English.
Before returning the answer, silently review it for unnatural wording, literal calques, incorrect word choices, grammar problems, missing meaning, and inappropriate vocabulary. Rewrite any awkward sentence before returning it.

LOWER-RESOURCE AND AFRICAN LANGUAGES:
For Yoruba, Hausa, Igbo, Swahili, and other African languages, prioritize authentic modern native usage over literal English equivalents. Do not invent vocabulary merely to match individual English words. When several translations are possible, choose the phrasing most natural in ordinary modern writing and speech.

YORUBA:
- Use standard modern Yoruba with correct grammar and appropriate tone marks/diacritics where naturally required.
- Prefer common native Yoruba expressions over artificial or dictionary-like constructions.
- Translate concepts according to their meaning in context rather than mapping each English word to a Yoruba word.
- Avoid unnecessarily formal, archaic, or invented vocabulary.
- For technology, business, creator, content, and digital concepts, use terminology that educated contemporary Yoruba speakers would naturally understand; retain an English technical term when a forced Yoruba equivalent would sound unnatural.
- After drafting, silently check that every sentence sounds natural to a native Yoruba speaker.

HAUSA:
- Use standard modern Hausa with natural Hausa sentence structure and vocabulary.
- Avoid copying English syntax.
- Prefer common Hausa expressions used in contemporary communication, business, technology, and everyday speech.
- Do not invent Hausa words simply to translate every English word literally.

IGBO:
- Use standard modern Igbo with natural Igbo grammar, vocabulary, and sentence structure.
- Avoid English word order when it produces unnatural Igbo.
- Prefer commonly understood contemporary Igbo expressions.
- Do not invent vocabulary simply to create a one-to-one equivalent for every English word.

SWAHILI:
- Use standard modern Swahili with natural grammar and vocabulary.
- Prefer established contemporary usage rather than literal English syntax.

If the target language is a lower-resource language and the exact technical term has no widely accepted native equivalent, keep the technical term in a natural way rather than inventing an unnatural translation.

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
