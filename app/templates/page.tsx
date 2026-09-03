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
  },
  {
    title: "Social media post",
    description: "Create engaging content for your social audience.",
    icon: PenLine,
    format: "Social post",
    prompt: "Create an engaging social media post about",
  },
  {
    title: "YouTube video script",
    description: "Build a clear and engaging video script.",
    icon: Video,
    format: "Video script",
    prompt: "Write an engaging YouTube video script about",
  },
  {
    title: "Professional email",
    description: "Write clear, professional emails quickly.",
    icon: Mail,
    format: "Blog post",
    prompt: "Write a professional email about",
  },
  {
    title: "Business proposal",
    description: "Turn your idea into a convincing proposal.",
    icon: Briefcase,
    format: "Blog post",
    prompt: "Write a professional business proposal about",
  },
  {
    title: "Product announcement",
    description: "Announce a product, launch, or new feature.",
    icon: Megaphone,
    format: "Social post",
    prompt: "Write a compelling product announcement about",
  },
];

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  function useTemplate(template: (typeof templates)[number]) {
    setSelectedTemplate(template.title);

    const params = new URLSearchParams({
      template: template.title,
      format: template.format,
      prompt: template.prompt,
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
            <span className="font-bold">SparkWriter</span>
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
            Choose a template, add your idea, and let SparkWriter create the
            first draft for you.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => {
            const Icon = template.icon;
            const selected = selectedTemplate === template.title;

            return (
              <button
                key={template.title}
                onClick={() => useTemplate(template)}
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
                  {selected ? "Opening..." : "Use template →"}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
