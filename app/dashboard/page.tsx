"use client";

import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  FileText,
  FolderOpen,
  HelpCircle,
  LayoutDashboard,
  Menu,
  PenLine,
  Plus,
  Search,
  Settings,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

const formats = [
  {
    title: "Blog post",
    description: "Create polished articles your readers will enjoy.",
    icon: FileText,
  },
  {
    title: "Social post",
    description: "Turn ideas into engaging social content.",
    icon: PenLine,
  },
  {
    title: "Video script",
    description: "Create clear scripts for YouTube and short videos.",
    icon: WandSparkles,
  },
  {
    title: "Rewrite",
    description: "Improve clarity, structure, tone, and impact.",
    icon: Sparkles,
  },
];

const documents = [
  {
    title: "The future of AI for creators",
    type: "Blog post",
    time: "Today",
  },
  {
    title: "10 productivity tips for creators",
    type: "Blog post",
    time: "Yesterday",
  },
  {
    title: "Instagram launch announcement",
    type: "Social post",
    time: "Aug 12",
  },
];

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [idea, setIdea] = useState("");
  const [format, setFormat] = useState("Blog post");

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950">
      {menuOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Sparkles size={19} />
            </div>

            <div>
              <div className="text-[17px] font-bold">SparkWriter</div>
              <div className="text-[11px] text-slate-400">
                AI writing studio
              </div>
            </div>
          </a>

          <button
            onClick={() => setMenuOpen(false)}
            className="rounded-lg p-2 text-slate-400 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        <div className="p-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
            <Plus size={17} />
            New document
          </button>
        </div>

        <nav className="flex-1 px-3">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Workspace
          </p>

          <NavItem icon={LayoutDashboard} label="Dashboard" active />
          <NavItem icon={FileText} label="Documents" />
          <NavItem icon={FolderOpen} label="Projects" />
          <NavItem icon={BookOpen} label="Templates" />

          <p className="px-3 pb-2 pt-7 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Account
          </p>

          <NavItem icon={BarChart3} label="Usage" />
          <NavItem icon={Settings} label="Settings" />
          <NavItem icon={HelpCircle} label="Help center" />
        </nav>

        <div className="m-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Free plan</span>
            <span className="text-[11px] text-slate-400">12 / 50</span>
          </div>

          <div className="mt-3 h-1.5 rounded-full bg-slate-200">
            <div className="h-full w-1/4 rounded-full bg-slate-900" />
          </div>

          <button className="mt-3 text-xs font-semibold">
            Upgrade plan →
          </button>
        </div>
      </aside>

      <section className="min-h-screen lg:pl-[260px]">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="rounded-xl border border-slate-200 p-2.5 lg:hidden"
            >
              <Menu size={19} />
            </button>

            <div>
              <p className="text-sm font-semibold">Good afternoon 👋</p>
              <p className="text-xs text-slate-400">
                What are you creating today?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden rounded-xl border border-slate-200 p-2.5 sm:block">
              <Search size={18} />
            </button>

            <button className="rounded-xl border border-slate-200 p-2.5">
              <Bell size={18} />
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
              SW
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <section className="rounded-[28px] bg-slate-950 p-6 text-white sm:p-8">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium">
                <Sparkles size={13} />
                AI-powered writing
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Turn your ideas into
                <span className="text-slate-400"> great content.</span>
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
                Start with an idea and let SparkWriter help you create
                content worth publishing.
              </p>
            </div>

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-2">
              <textarea
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
                placeholder="What do you want to write about?"
                className="min-h-[120px] w-full resize-none bg-transparent p-4 text-sm text-white outline-none placeholder:text-slate-500"
              />

              <div className="flex flex-col gap-2 border-t border-white/10 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  {["Blog post", "Social post", "Video script"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setFormat(item)}
                      className={`rounded-lg px-3 py-2 text-xs font-medium ${
                        format === item
                          ? "bg-white text-slate-950"
                          : "text-slate-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <button className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-slate-950">
                  Generate
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </section>

          <section className="mt-9">
            <div className="mb-4">
              <h2 className="text-lg font-bold">Start with a format</h2>
              <p className="mt-1 text-xs text-slate-400">
                Choose what you want SparkWriter to create.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {formats.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.title}
                    onClick={() => setFormat(item.title)}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-slate-950 group-hover:text-white">
                      <Icon size={19} />
                    </div>

                    <h3 className="text-sm font-bold">{item.title}</h3>

                    <p className="mt-1.5 text-xs leading-5 text-slate-400">
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-9">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Recent documents</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Continue where you left off.
                </p>
              </div>

              <button className="text-xs font-semibold text-slate-500">
                View all
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {documents.map((document, index) => (
                <button
                  key={document.title}
                  className={`flex w-full items-center gap-4 px-4 py-4 text-left hover:bg-slate-50 sm:px-5 ${
                    index !== documents.length - 1
                      ? "border-b border-slate-100"
                      : ""
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    <FileText size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {document.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {document.type} · {document.time}
                    </p>
                  </div>

                  <ArrowRight size={16} className="text-slate-300" />
                </button>
              ))}
            </div>
          </section>

          <footer className="py-10 text-center text-xs text-slate-400">
            SparkWriter · Your AI writing studio
          </footer>
        </div>
      </section>
    </main>
  );
}

function NavItem({
  icon: Icon,
  label,
  active = false,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
        active
          ? "bg-slate-100 text-slate-950"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
      }`}
    >
      <Icon size={17} />
      {label}
    </button>
  );
}
