"use client";

import {
  ArrowRight,
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
    href: "/signup",
  },
  {
    icon: PenLine,
    title: "Social content",
    description: "Create engaging posts for every major platform.",
    href: "/signup",
  },
  {
    icon: Video,
    title: "Video scripts",
    description: "Build hooks, scripts and descriptions that keep people watching.",
    href: "/signup",
  },
  {
    icon: FileText,
    title: "Professional emails",
    description: "Write clear, polished emails for clients, teams and business communication.",
    href: "/signup",
  },
  {
    icon: FileText,
    title: "Business proposals",
    description: "Turn ideas into structured proposals that communicate value clearly.",
    href: "/signup",
  },
  {
    icon: WandSparkles,
    title: "Rewrite & improve",
    description: "Rewrite existing content for clearer structure, stronger tone and better impact.",
    href: "/signup",
  },
  {
    icon: Sparkles,
    title: "Summarize",
    description: "Turn longer content into concise summaries that keep the important points.",
    href: "/signup",
  },
  {
    icon: PenLine,
    title: "Continue writing",
    description: "Pick up where you stopped and keep your content flowing naturally.",
    href: "/signup",
  },
  {
    icon: FileText,
    title: "Translate",
    description: "Translate content across dozens of languages with a dedicated public translator.",
    href: "/translator",
  },
];

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "annual">("monthly");

  return (
    <main className="min-h-screen overflow-hidden bg-[#faf9f7] text-[#18181b]">
      {/* Navigation */}
      <nav className="relative z-50 border-b border-black/[0.06] bg-[#faf9f7]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="/" className="flex items-center gap-2.5">
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
            <a
              href="/translator"
              className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
            >
              Translator
            </a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a href="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-black/[0.04]">
              Sign in
            </a>
            <a href="/signup" className="flex items-center gap-2 rounded-full bg-[#18181b] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-zinc-800">
              Start writing
              <ArrowRight size={15} />
            </a>
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
              <a href="/translator" className="font-medium">
                Translator
              </a>
              <a href="/login" className="mt-2 rounded-full border border-black/[0.08] px-5 py-3 text-center font-semibold">
                Sign in
              </a>
              <a href="/signup" className="rounded-full bg-[#18181b] px-5 py-3 text-center font-semibold text-white">
                Start writing
              </a>
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
              AI writing, made simple
            </div>

            <h1 className="text-balance text-5xl font-bold leading-[0.98] tracking-[-0.065em] sm:text-7xl lg:text-[88px]">
              Write better.
              <span className="block bg-gradient-to-r from-orange-500 via-rose-500 to-violet-600 bg-clip-text text-transparent">
                Create faster.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
              Turn rough ideas into polished content with AI — from blog posts and social content to emails, proposals, video scripts, rewrites, summaries, and translations.
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

              <a href="#how-it-works" className="flex h-13 w-full items-center justify-center gap-2 rounded-full border border-black/[0.09] bg-white/70 px-7 text-sm font-semibold text-zinc-700 transition hover:bg-white sm:w-auto">
                <Play size={15} fill="currentColor" />
                See how it works
              </a>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500">
              <Check size={14} className="text-emerald-600" />
              No credit card required
              <span className="mx-1">•</span>
              Start creating in seconds
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
                <a
                  key={tool.title}
                  href={tool.href}
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
                </a>
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
                Start with an idea, give Writnexa the direction you want,
                then refine the result until it feels like your own.
              </p>

              <div className="mt-9 space-y-5">
                {[
                  ["01", "Start with an idea, draft or piece of content."],
                  ["02", "Choose your format, tone and writing direction."],
                  ["03", "Generate, refine and make the final result yours."],
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
                  Writnexa AI
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

      {/* Pricing */}
      <section id="pricing" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
              Simple pricing
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              Choose the plan that fits your workflow.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-600">
              Start free, then upgrade when you need more writing capacity.
              All plans give you access to the Writnexa writing workspace.
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-full border border-zinc-200 bg-zinc-100 p-1">
              <button
                type="button"
                onClick={() => setBillingInterval("monthly")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  billingInterval === "monthly"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingInterval("annual")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  billingInterval === "annual"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Annual
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-zinc-900">Free</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">₦0</span>
                <span className="text-sm text-zinc-400">/month</span>
              </div>
              <p className="mt-2 text-sm text-zinc-500">
                A simple way to get started.
              </p>
              <div className="mt-6 space-y-3 text-sm text-zinc-600">
                <p>✓ 50 documents/month</p>
                <p>✓ AI writing tools</p>
                <p>✓ Templates and rewriting</p>
              </div>
              <a
                href="/signup"
                className="mt-8 flex h-11 items-center justify-center rounded-full border border-zinc-200 text-sm font-bold text-zinc-900 transition hover:bg-zinc-50"
              >
                Get started
              </a>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-zinc-900">Starter</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{billingInterval === "monthly" ? "₦2,500" : "₦25,000"}</span>
                <span className="text-sm text-zinc-400">/{billingInterval === "monthly" ? "month" : "year"}</span>
              </div>
              <p className="mt-2 text-sm text-zinc-500">
                More room for regular content creation.
              </p>
              <div className="mt-6 space-y-3 text-sm text-zinc-600">
                <p>✓ 200 documents/month</p>
                <p>✓ AI writing tools</p>
                <p>✓ Templates, rewriting and summaries</p>
              </div>
              <a
                href="/signup"
                className="mt-8 flex h-11 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white transition hover:bg-zinc-700"
              >
                Choose Starter
              </a>
            </div>

            <div className="relative rounded-3xl bg-[#18181b] p-6 text-white shadow-xl">
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                Most popular
              </span>
              <p className="mt-4 text-sm font-bold">Pro</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{billingInterval === "monthly" ? "₦5,000" : "₦50,000"}</span>
                <span className="text-sm text-white/50">/{billingInterval === "monthly" ? "month" : "year"}</span>
              </div>
              <p className="mt-2 text-sm text-white/60">
                For serious creators and higher-volume writing.
              </p>
              <div className="mt-6 space-y-3 text-sm text-white/75">
                <p>✓ 500 documents/month</p>
                <p>✓ Full AI writing workspace</p>
                <p>✓ Templates, rewriting, summaries and translation</p>
              </div>
              <a
                href="/signup"
                className="mt-8 flex h-11 items-center justify-center rounded-full bg-white text-sm font-bold text-zinc-950 transition hover:bg-zinc-200"
              >
                Choose Pro
              </a>
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
          <a href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200">
            Start writing for free
            <ArrowRight size={16} />
          </a>
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
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
