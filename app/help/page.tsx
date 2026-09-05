"use client";

import {
  ArrowLeft,
  BookOpen,
  FileText,
  FolderOpen,
  HelpCircle,
  Search,
  Settings,
  Sparkles,
  UserCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const helpSections = [
  {
    icon: Sparkles,
    title: "Getting started",
    description: "Learn how to turn an idea into polished content with Writnexa.",
    articles: [
      {
        question: "How do I create content?",
        answer:
          "Enter what you want to write in the idea box on the Dashboard, choose a format and tone, then select Generate. Writnexa will create the first draft for you.",
      },
      {
        question: "Which content formats are available?",
        answer:
          "Writnexa currently supports Blog post, Social post, Video script, Professional email, Business proposal, Product announcement, and Rewrite.",
      },
      {
        question: "Can I change the writing tone?",
        answer:
          "Yes. Choose a tone from the Dashboard or update your default writing preference in Settings.",
      },
    ],
  },
  {
    icon: FileText,
    title: "Writing & documents",
    description: "Manage, edit, save, search, rename, and export your writing.",
    articles: [
      {
        question: "How are my documents saved?",
        answer:
          "Documents created in Writnexa can be saved to your account and are associated with your signed-in user. Your saved documents can be accessed again from Documents and the Dashboard.",
      },
      {
        question: "Can I rename a document?",
        answer:
          "Yes. Find the document in your recent documents or Documents area and use Rename to change its title.",
      },
      {
        question: "Can I search my documents?",
        answer:
          "Yes. Use the document search field to quickly find saved documents by their available document information.",
      },
      {
        question: "Can I export my writing?",
        answer:
          "Writnexa supports downloading content in supported formats including TXT, Markdown, DOCX, and PDF.",
      },
    ],
  },
  {
    icon: BookOpen,
    title: "Templates & Rewrite",
    description: "Get the most from Writnexa's writing workflows.",
    articles: [
      {
        question: "What are Templates?",
        answer:
          "Templates give you a structured starting point for common writing tasks. Select a template, provide the requested information, and generate your content.",
      },
      {
        question: "How does Rewrite work?",
        answer:
          "Rewrite lets you provide existing text and improve its clarity, structure, tone, and impact without starting from scratch.",
      },
    ],
  },
  {
    icon: FolderOpen,
    title: "Projects",
    description: "Keep related writing organized in one place.",
    articles: [
      {
        question: "What are Projects?",
        answer:
          "Projects help you organize related work together so you can keep your writing workflow structured and easier to manage.",
      },
      {
        question: "Do my projects remain after I refresh the page?",
        answer:
          "Saved project information is designed to persist so you can return to your work later.",
      },
    ],
  },
  {
    icon: Settings,
    title: "Settings",
    description: "Control your writing preferences and account experience.",
    articles: [
      {
        question: "What can I change in Settings?",
        answer:
          "Settings lets you manage available writing preferences, including your default writing tone.",
      },
      {
        question: "Do my saved preferences affect the Dashboard?",
        answer:
          "Yes. Your saved writing preferences can be applied when you return to the Dashboard.",
      },
    ],
  },
  {
    icon: UserCircle,
    title: "Account & access",
    description: "Manage your account and understand your current plan.",
    articles: [
      {
        question: "How do I sign out?",
        answer:
          "Open Account and select Sign out. You can sign back in whenever you want to continue working.",
      },
      {
        question: "Where can I see my saved document usage?",
        answer:
          "Your Account page shows your current saved-document count and usage. The Dashboard also displays your current usage.",
      },
      {
        question: "What does the Free plan include?",
        answer:
          "The current Dashboard displays a Free plan with a 50-document usage target. Billing and paid-plan functionality are not currently active.",
      },
    ],
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const filteredSections = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return helpSections;
    }

    return helpSections
      .map((section) => ({
        ...section,
        articles: section.articles.filter(
          (article) =>
            article.question.toLowerCase().includes(query) ||
            article.answer.toLowerCase().includes(query) ||
            section.title.toLowerCase().includes(query) ||
            section.description.toLowerCase().includes(query)
        ),
      }))
      .filter((section) => section.articles.length > 0);
  }, [search]);

  const totalResults = filteredSections.reduce(
    (total, section) => total + section.articles.length,
    0
  );

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-5 w-5" />
            Writnexa
          </div>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <HelpCircle className="h-6 w-6" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How can we help?
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Find answers about creating content, managing documents, using
            templates, account settings, and more.
          </p>

          <div className="mx-auto mt-7 max-w-2xl">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search the Help Center..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                aria-label="Search Help Center"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        {search && (
          <p className="mb-6 text-sm text-slate-500">
            {totalResults} {totalResults === 1 ? "result" : "results"} found
            for <span className="font-semibold text-slate-700">"{search}"</span>
          </p>
        )}

        {filteredSections.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <Search className="mx-auto h-8 w-8 text-slate-400" />
            <h2 className="mt-4 text-lg font-semibold">No results found</h2>
            <p className="mt-2 text-sm text-slate-500">
              Try a different search term or browse the help topics below.
            </p>
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Browse all help
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredSections.map((section) => {
              const Icon = section.icon;

              return (
                <article
                  key={section.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-semibold">{section.title}</h2>
                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 divide-y divide-slate-100">
                    {section.articles.map((article) => {
                      const isOpen = openQuestion === article.question;

                      return (
                        <div key={article.question} className="py-3 first:pt-0 last:pb-0">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenQuestion(isOpen ? null : article.question)
                            }
                            className="flex w-full items-center justify-between gap-4 text-left text-sm font-semibold"
                          >
                            <span>{article.question}</span>
                            <span className="text-lg text-slate-400">
                              {isOpen ? "−" : "+"}
                            </span>
                          </button>

                          {isOpen && (
                            <p className="mt-2 pr-6 text-sm leading-6 text-slate-600">
                              {article.answer}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>Writnexa · Your AI writing studio</span>
          <Link
            href="/dashboard"
            className="font-semibold text-slate-700 hover:text-slate-950"
          >
            Return to Dashboard
          </Link>
        </div>
      </footer>
    </main>
  );
}
