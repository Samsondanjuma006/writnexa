"use client";

import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  FileText,
  Menu,
  PenLine,
  Play,
  Sparkles,
  WandSparkles,
  X,
  Video,
} from "lucide-react";
import { useState } from "react";

const tools = [
  {
    icon: FileText,
    title: "Blog posts",
    description: "Turn your ideas into polished, SEO-ready articles.",
  },
  {
    icon: PenLine,
    title: "Social content",
    description: "Create engaging posts for every major platform.",
  },
  {
    icon: Video,
    title: "Video scripts",
    description: "Build hooks, scripts and descriptions that keep people watching.",
  },
];

const benefits = [
  "Write faster without losing your voice",
  "Create content for multiple platforms",
  "Turn rough ideas into polished drafts",
  "Keep your brand voice consistent",
];

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#faf9f7] text-[#18181b]">
      {/* Navigation */}
      <nav className="relative z-50 border-b border-black/[0.06] bg-[#faf9f7]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#18181b] text-white shadow-lg shadow-black/10">
              <Sparkles size={18} strokeWidth={2.2} />
            </span>
            <span className="text-xl font-bold tracking-[-0.04em]">
              Writnexa
            </span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
            >
              Pricing
            </a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-black/[0.04]">
              Sign in
            </button>
            <button className="flex items-center gap-2 rounded-full bg-[#18181b] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-zinc-800">
              Start writing
              <ArrowRight size={15} />
            </button>
          </div>

          <button
            className="rounded-xl p-2 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-black/[0.06] bg-[#faf9f7] px-5 py-5 md:hidden">
            <div className="flex flex-col gap-4">
              <a href="#features" className="font-medium">
                Features
              </a>
              <a href="#how-it-works" className="font-medium">
                How it works
              </a>
              <a href="#pricing" className="font-medium">
                Pricing
              </a>
              <button className="mt-2 rounded-full bg-[#18181b] px-5 py-3 font-semibold text-white">
                Start writing
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-orange-200/30 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/70 px-3.5 py-2 text-xs font-semibold text-zinc-600 shadow-sm backdrop-blur">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <WandSparkles size={12} />
              </span>
              Your new AI writing workspace
            </div>

            <h1 className="text-balance text-5xl font-bold leading-[0.98] tracking-[-0.065em] sm:text-7xl lg:text-[88px]">
              Your ideas deserve
              <span className="block bg-gradient-to-r from-orange-500 via-rose-500 to-violet-600 bg-clip-text text-transparent">
                better words.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
              Writnexa turns rough ideas into polished blogs, social posts,
              video scripts and more — while helping you keep your own voice.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="/signup"
                className="group flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#18181b] px-7 text-sm font-semibold text-white shadow-xl shadow-black/15 transition hover:-translate-y-0.5 hover:bg-zinc-800 sm:w-auto"
              >
                Start writing for free
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>

              <button className="flex h-13 w-full items-center justify-center gap-2 rounded-full border border-black/[0.09] bg-white/70 px-7 text-sm font-semibold text-zinc-700 transition hover:bg-white sm:w-auto">
                <Play size={15} fill="currentColor" />
                See how it works
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500">
              <Check size={14} className="text-emerald-600" />
              No credit card required
              <span className="mx-1">•</span>
              Start creating in seconds
            </div>
          </div>

          {/* Product preview */}
          <div className="relative mx-auto mt-16 max-w-6xl sm:mt-20">
            <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-r from-orange-200/30 via-transparent to-violet-200/30 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_30px_100px_-30px_rgba(0,0,0,0.25)] sm:rounded-3xl">
              <div className="flex h-12 items-center border-b border-black/[0.06] bg-white px-4 sm:h-14 sm:px-5">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                </div>

                <div className="mx-auto hidden items-center gap-2 rounded-lg bg-zinc-50 px-3 py-1.5 text-xs text-zinc-500 sm:flex">
                  <Sparkles size={12} />
                  Writnexa
                </div>
              </div>

              <div className="grid min-h-[430px] md:grid-cols-[220px_1fr]">
                <aside className="hidden border-r border-black/[0.06] bg-[#fcfcfb] p-4 md:block">
                  <div className="mb-7 flex items-center gap-2 text-sm font-bold">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#18181b] text-white">
                      <Sparkles size={13} />
                    </span>
                    Writnexa
                  </div>

                  <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Create
                  </p>

                  <div className="space-y-1">
                    {["Blog post", "Social post", "Video script", "Rewrite"].map(
                      (item, index) => (
                        <div
                          key={item}
                          className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium ${
                            index === 0
                              ? "bg-zinc-100 text-zinc-900"
                              : "text-zinc-500"
                          }`}
                        >
                          {index === 0 ? (
                            <BookOpen size={14} />
                          ) : (
                            <PenLine size={14} />
                          )}
                          {item}
                        </div>
                      ),
                    )}
                  </div>
                </aside>

                <div className="p-6 sm:p-9">
                  <div className="mx-auto max-w-2xl">
                    <div className="mb-6">
                      <p className="text-xs font-semibold text-orange-500">
                        BLOG POST
                      </p>
                      <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                        Create content your audience remembers
                      </h3>
                    </div>

                    <div className="rounded-2xl border border-black/[0.07] bg-[#fcfcfb] p-4 shadow-sm sm:p-5">
                      <p className="text-sm leading-6 text-zinc-500">
                        Write an article about how small businesses can use AI
                        to save time and grow their audience...
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-medium text-zinc-500 shadow-sm ring-1 ring-black/[0.05]">
                          Professional
                        </span>
                        <span className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-medium text-zinc-500 shadow-sm ring-1 ring-black/[0.05]">
                          Medium length
                        </span>
                        <span className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-medium text-zinc-500 shadow-sm ring-1 ring-black/[0.05]">
                          SEO friendly
                        </span>
                      </div>

                      <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#18181b] py-3 text-xs font-semibold text-white">
                        <Sparkles size={14} />
                        Generate content
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-black/[0.06] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
              Everything in one place
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              One workspace for all your content.
            </h2>
            <p className="mt-5 text-base leading-7 text-zinc-600">
              From the first idea to the final draft, Writnexa gives creators
              the tools to move faster without sacrificing quality.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {tools.map((tool) => {
              const Icon = tool.icon;

              return (
                <div
                  key={tool.title}
                  className="group rounded-3xl border border-black/[0.07] bg-[#faf9f7] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.06]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/[0.05]">
                    <Icon size={19} />
                  </div>

                  <h3 className="mt-7 text-xl font-bold tracking-tight">
                    {tool.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    {tool.description}
                  </p>

                  <div className="mt-7 flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
                    Explore tool
                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-[#faf9f7]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
                Simple by design
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
                From blank page to publish-ready.
              </h2>

              <p className="mt-5 max-w-lg text-base leading-7 text-zinc-600">
                You bring the idea. Writnexa helps shape it into something
                worth publishing.
              </p>

              <div className="mt-9 space-y-5">
                {[
                  ["01", "Tell us what you want to create."],
                  ["02", "Choose your audience, tone and format."],
                  ["03", "Generate, refine and make it yours."],
                ].map(([number, text]) => (
                  <div key={number} className="flex items-center gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#18181b] text-xs font-bold text-white">
                      {number}
                    </span>
                    <span className="text-sm font-semibold text-zinc-800">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-black/[0.07] bg-white p-5 shadow-xl shadow-black/[0.04] sm:p-7">
              <div className="rounded-2xl bg-[#18181b] p-6 text-white sm:p-8">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Sparkles size={13} />
                  WRITNEXA AI
                </div>

                <h3 className="mt-7 text-2xl font-bold tracking-tight">
                  Make your next idea impossible to ignore.
                </h3>

                <p className="mt-4 text-sm leading-6 text-zinc-400">
                  Generate a clear, engaging draft tailored to your audience
                  and your unique style.
                </p>

                <div className="mt-8 h-px bg-white/10" />

                <div className="mt-5 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Ready to create</span>
                  <span className="flex items-center gap-1.5 font-semibold text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    AI online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="pricing" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="rounded-[32px] bg-[#f4f1ec] p-7 sm:p-12 lg:p-16">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
                  Built for creators
                </p>
                <h2 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
                  Spend less time staring at the cursor.
                </h2>
                <p className="mt-5 text-base leading-7 text-zinc-600">
                  Writnexa handles the heavy lifting so you can spend more
                  time creating, publishing and growing.
                </p>
              </div>

              <div className="grid gap-3">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4 text-sm font-medium shadow-sm"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <Check size={14} />
                    </span>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#18181b] text-white">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <Sparkles className="mx-auto" size={28} />
          <h2 className="mt-6 text-4xl font-bold tracking-[-0.05em] sm:text-6xl">
            Your next great piece starts with an idea.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
            Turn that idea into something people want to read, watch and share.
          </p>
          <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200">
            Start writing for free
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#18181b] text-zinc-400">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 border-t border-white/[0.08] px-5 py-8 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-2 text-white">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
              <Sparkles size={13} />
            </span>
            <span className="font-semibold">Writnexa</span>
          </div>

          <div>© {new Date().getFullYear()} Writnexa. Built for creators.</div>

          <div className="flex gap-5">
            <a href="#" className="transition hover:text-white">
              Privacy
            </a>
            <a href="#" className="transition hover:text-white">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
