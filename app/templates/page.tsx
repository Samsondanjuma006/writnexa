"use client";

import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  FileText,
  Mail,
  Megaphone,
  PenLine,
  Sparkles,
  Video,
} from "lucide-react";
import { useState } from "react";

const templates = [
  {
    title: "Blog post",
    description: "Create a polished article from a simple idea.",
    icon: FileText,
    format: "Blog post",
    prompt: "Write a detailed blog post about",
    placeholder: "e.g. How AI is changing education in Nigeria",
  },
  {
    title: "Social media post",
    description: "Create engaging content for your social audience.",
    icon: PenLine,
    format: "Social post",
    prompt: "Create an engaging social media post about",
    placeholder: "e.g. A new productivity tip for busy professionals",
  },
  {
    title: "YouTube video script",
    description: "Build a clear and engaging video script.",
    icon: Video,
    format: "Video script",
    prompt: "Write an engaging YouTube video script about",
    placeholder: "e.g. 5 ways to save money every month",
  },
  {
    title: "Professional email",
    description: "Write clear, professional emails quickly.",
    icon: Mail,
    format: "Professional email",
    prompt: "Write a professional email about",
    placeholder: "e.g. Requesting a meeting with a client",
  },
  {
    title: "Business proposal",
    description: "Turn your idea into a convincing proposal.",
    icon: Briefcase,
    format: "Business proposal",
    prompt: "Write a professional business proposal about",
    placeholder: "e.g. A digital marketing service for small businesses",
  },
  {
    title: "Product announcement",
    description: "Announce a product, launch, or new feature.",
    icon: Megaphone,
    format: "Product announcement",
    prompt: "Write a compelling product announcement about",
    placeholder: "e.g. Launching our new mobile app",
  },
  {
    title: "Rewrite",
    description: "Improve clarity, structure, tone, and impact.",
    icon: PenLine,
    format: "Rewrite",
    prompt: "Rewrite and improve the following text",
    placeholder: "Paste the text you want Writnexa to improve",
  },
];

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<
    (typeof templates)[number] | null
  >(null);
  const [idea, setIdea] = useState("");

  function openTemplate(template: (typeof templates)[number]) {
    setSelectedTemplate(template);
    setIdea("");
  }

  function useTemplate() {
    if (!selectedTemplate || !idea.trim()) {
      return;
    }

    const params = new URLSearchParams({
      template: selectedTemplate.title,
      format: selectedTemplate.format,
      prompt: idea.trim(),
    });

    window.location.href = `/dashboard?${params.toString()}`;
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </a>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Sparkles size={17} />
            </div>
            <span className="font-bold">Writnexa</span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-medium text-white">
            <Sparkles size={13} />
            Writing templates
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Start faster with a template.
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            Choose a template, add your idea, and let Writnexa create the
            first draft for you.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => {
            const Icon = template.icon;

            return (
              <button
                key={template.title}
                onClick={() => openTemplate(template)}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                    <Icon size={19} />
                  </div>

                  <ArrowRight
                    size={17}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-950"
                  />
                </div>

                <h2 className="mt-5 text-base font-bold">{template.title}</h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {template.description}
                </p>

                <span className="mt-5 inline-block text-xs font-semibold text-slate-950">
                  Use template →
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {selectedTemplate.title}
                </div>
                <h2 className="mt-1 text-xl font-bold">
                  What do you want to write about?
                </h2>
              </div>

              <button
                onClick={() => setSelectedTemplate(null)}
                className="rounded-lg px-2 py-1 text-sm text-slate-400 transition hover:bg-slate-100 hover:text-slate-950"
              >
                ✕
              </button>
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {selectedTemplate.description}
            </p>

            <textarea
              autoFocus
              value={idea}
              onChange={(event) => setIdea(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  (event.ctrlKey || event.metaKey)
                ) {
                  useTemplate();
                }
              }}
              placeholder={selectedTemplate.placeholder}
              rows={5}
              className="mt-5 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={useTemplate}
                disabled={!idea.trim()}
                className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Use template →
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
