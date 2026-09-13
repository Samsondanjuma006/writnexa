"use client";

import {
  ArrowLeftRight,
  Check,
  Clipboard,
  Languages,
  Loader2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const languages = [
  "English",
  "Spanish",
  "French",
  "Portuguese",
  "German",
  "Italian",
  "Dutch",
  "Russian",
  "Ukrainian",
  "Polish",
  "Turkish",
  "Greek",
  "Romanian",
  "Arabic",
  "Hebrew",
  "Persian",
  "Hindi",
  "Bengali",
  "Urdu",
  "Punjabi",
  "Gujarati",
  "Marathi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Chinese (Simplified)",
  "Chinese (Traditional)",
  "Japanese",
  "Korean",
  "Indonesian",
  "Malay",
  "Vietnamese",
  "Thai",
  "Swahili",
  "Hausa",
  "Yoruba",
  "Igbo",
  "Amharic",
  "Afrikaans",
];

export default function TranslatorPage() {
  const [sourceText, setSourceText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("Auto-detect");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const translate = async () => {
    if (!sourceText.trim()) {
      setError("Enter some text to translate.");
      return;
    }

    if (!targetLanguage) {
      setError("Select a target language.");
      return;
    }

    setLoading(true);
    setError("");
    setTranslation("");
    setCopied(false);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: sourceText,
          sourceLanguage,
          targetLanguage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to translate the text.",
        );
      }

      setTranslation(data.translation || "");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to translate the text.",
      );
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    if (sourceLanguage === "Auto-detect") {
      return;
    }

    const previousSource = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(previousSource);

    if (translation) {
      setSourceText(translation);
      setTranslation("");
    }
  };

  const copyTranslation = async () => {
    if (!translation) return;

    try {
      await navigator.clipboard.writeText(translation);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setError("Unable to copy the translation.");
    }
  };

  const clearAll = () => {
    setSourceText("");
    setTranslation("");
    setError("");
    setCopied(false);
  };

  return (
    <main className="min-h-screen bg-[#faf9f7] text-[#18181b]">
      <nav className="border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white">
              <Sparkles size={16} />
            </span>
            Writnexa
          </a>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="hidden rounded-xl px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 sm:inline-flex"
            >
              Sign in
            </a>

            <a
              href="/signup"
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Start writing
            </a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white">
            <Languages size={23} />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Writnexa Translator
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Translate naturally, not word for word.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
            Translate text between languages with a simple, fast workspace
            designed for natural and readable results.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-6xl">
          <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-start">
              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <label
                    htmlFor="source-language"
                    className="text-sm font-semibold text-zinc-800"
                  >
                    From
                  </label>

                  <select
                    id="source-language"
                    value={sourceLanguage}
                    onChange={(event) =>
                      setSourceLanguage(event.target.value)
                    }
                    className="max-w-[190px] rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-zinc-400"
                  >
                    <option>Auto-detect</option>
                    {languages.map((language) => (
                      <option key={language}>{language}</option>
                    ))}
                  </select>
                </div>

                <textarea
                  value={sourceText}
                  onChange={(event) =>
                    setSourceText(event.target.value.slice(0, 8000))
                  }
                  placeholder="Enter text to translate..."
                  className="min-h-[280px] w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-7 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white"
                />

                <div className="mt-2 flex justify-end text-xs text-zinc-400">
                  {sourceText.length.toLocaleString()} / 8,000
                </div>
              </div>

              <div className="flex justify-center lg:pt-11">
                <button
                  type="button"
                  onClick={swapLanguages}
                  disabled={sourceLanguage === "Auto-detect"}
                  className="rounded-full border border-zinc-200 bg-white p-3 text-zinc-600 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Swap languages"
                  title="Swap languages"
                >
                  <ArrowLeftRight size={18} />
                </button>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <label
                    htmlFor="target-language"
                    className="text-sm font-semibold text-zinc-800"
                  >
                    Translate to
                  </label>

                  <select
                    id="target-language"
                    value={targetLanguage}
                    onChange={(event) =>
                      setTargetLanguage(event.target.value)
                    }
                    className="max-w-[190px] rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-zinc-400"
                  >
                    {languages.map((language) => (
                      <option key={language}>{language}</option>
                    ))}
                  </select>
                </div>

                <div className="min-h-[280px] whitespace-pre-wrap rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-7 text-zinc-800">
                  {loading ? (
                    <div className="flex min-h-[248px] items-center justify-center">
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <Loader2 className="animate-spin" size={18} />
                        Translating...
                      </div>
                    </div>
                  ) : translation ? (
                    translation
                  ) : (
                    <span className="text-zinc-400">
                      Your translation will appear here...
                    </span>
                  )}
                </div>

                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={copyTranslation}
                    disabled={!translation || loading}
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {copied ? (
                      <>
                        <Check size={15} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Clipboard size={15} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
              >
                <Trash2 size={16} />
                Clear
              </button>

              <button
                type="button"
                onClick={translate}
                disabled={loading || !sourceText.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={17} />
                    Translating...
                  </>
                ) : (
                  <>
                    <Languages size={17} />
                    Translate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
