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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useState } from "react";
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

type SavedDocument = {
  id: string;
  title: string;
  type: string;
  time: string;
  content: string;
};

const documents: SavedDocument[] = [
  {
    id: "starter-1",
    title: "The future of AI for creators",
    type: "Blog post",
    time: "Today",
    content: "",
  },
  {
    id: "starter-2",
    title: "10 productivity tips for creators",
    type: "Blog post",
    time: "Yesterday",
    content: "",
  },
  {
    id: "starter-3",
    title: "Instagram launch announcement",
    type: "Social post",
    time: "Aug 12",
    content: "",
  },
];

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [idea, setIdea] = useState("");
  const [format, setFormat] = useState("Blog post");
  const [tone, setTone] = useState("Professional");
  const [content, setContent] = useState("");
  const [contentHistory, setContentHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [editing, setEditing] = useState(false);
  const [documentSearch, setDocumentSearch] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [savedDocuments, setSavedDocuments] = useState(documents);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const [renamingDocumentId, setRenamingDocumentId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sparkwriter-documents");

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setSavedDocuments(parsed);
        }
      }
    } catch {
      console.error("Unable to load saved documents.");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "sparkwriter-documents",
        JSON.stringify(savedDocuments),
      );
    } catch {
      console.error("Unable to save documents.");
    }
  }, [savedDocuments]);

  useEffect(() => {
    if (!editing || !content.trim()) return;

    setSaveStatus("saving");

    const timer = window.setTimeout(() => {
      saveDocument(content, format, activeDocumentId);
      setSaveStatus("saved");
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [content, editing, format, activeDocumentId]);

  function updateContentWithHistory(nextContent: string) {
    setContent(nextContent);

    setContentHistory((current) => {
      const nextHistory = current.slice(0, historyIndex + 1);
      nextHistory.push(nextContent);
      return nextHistory.slice(-30);
    });

    setHistoryIndex((current) => Math.min(current + 1, 29));
  }

  function undoContent() {
    if (historyIndex <= 0) return;

    const nextIndex = historyIndex - 1;
    setHistoryIndex(nextIndex);
    setContent(contentHistory[nextIndex]);
  }

  function redoContent() {
    if (historyIndex >= contentHistory.length - 1) return;

    const nextIndex = historyIndex + 1;
    setHistoryIndex(nextIndex);
    setContent(contentHistory[nextIndex]);
  }

  async function generateContent() {

    if (!idea.trim()) {
      setError("Please enter an idea first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea,
          type: format,
          tone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const demoContent = createDemoContent(idea, format);
        updateContentWithHistory(demoContent);
        saveDocument(demoContent, format, null);
        setError("AI credits are unavailable, so SparkWriter is using Demo Mode.");
        return;
      }

      updateContentWithHistory(data.content || "");
      saveDocument(data.content || "", format, null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating content.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function runWritingAction(action: string) {
    if (!content.trim()) {
      setError("Generate some content first.");
      return;
    }

    setActionLoading(action);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea: content,
          type: `${action} ${format}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to process the content.");
      }

      const updatedContent = data.content || "";

      if (!updatedContent.trim()) {
        throw new Error("The AI returned empty content.");
      }

      updateContentWithHistory(updatedContent);
      saveDocument(updatedContent, format);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while editing the content.",
      );
    } finally {
      setActionLoading("");
    }
  }

  async function copyContent() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Unable to copy content.");
    }
  }

  function downloadContent() {
    if (!content.trim()) return;

    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${format.toLowerCase().replace(/\s+/g, "-")}-sparkwriter.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  function downloadMarkdown() {
    if (!content.trim()) return;

    const blob = new Blob([content], {
      type: "text/markdown;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${format.toLowerCase().replace(/\s+/g, "-")}-sparkwriter.md`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function deleteDocument(id: string) {
    const documentToDelete = savedDocuments.find(
      (document) => document.id === id,
    );

    if (!documentToDelete) return;

    const confirmed = window.confirm(
      `Delete "${documentToDelete.title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setSavedDocuments((current) =>
      current.filter((document) => document.id !== id),
    );

    if (activeDocumentId === id) {
      setActiveDocumentId(null);
      setContent("");
      setIdea("");
      setFormat("Blog post");
      setContentHistory([]);
      setHistoryIndex(-1);
      setEditing(false);
      setSaveStatus("saved");
    }
  }

  function startRenamingDocument(document: SavedDocument) {
    setRenamingDocumentId(document.id);
    setRenameTitle(document.title);
  }

  function cancelRenamingDocument() {
    setRenamingDocumentId(null);
    setRenameTitle("");
  }

  function saveRenamedDocument(id: string) {
    const title = renameTitle.trim();

    if (!title) {
      setError("Document title cannot be empty.");
      return;
    }

    setSavedDocuments((current) =>
      current.map((document) =>
        document.id === id
          ? {
              ...document,
              title: title.slice(0, 80),
              time: "Just now",
            }
          : document,
      ),
    );

    if (activeDocumentId === id) {
      setIdea(title.slice(0, 80));
    }

    cancelRenamingDocument();
    setError("");
  }

  function saveDocument(
    text: string,
    type: string,
    documentId: string | null = activeDocumentId,
  ) {
    const firstLine =
      text
        .split("\n")
        .map((line: string) => line.replace(/^#+\s*/, "").trim())
        .find((line: string) => line.length > 0) || "Untitled document";

    const title = firstLine.slice(0, 80);
    const id = documentId || Date.now().toString();

    setSavedDocuments((current) => {
      const existing = current.find((document) => document.id === id);

      const updatedDocument: SavedDocument = {
        id,
        title: existing?.title || title,
        type,
        time: "Just now",
        content: text,
      };

      if (existing) {
        return [
          updatedDocument,
          ...current.filter((document) => document.id !== id),
        ].slice(0, 10);
      }

      return [updatedDocument, ...current].slice(0, 10);
    });

    setActiveDocumentId(id);
    return id;
  }

 function selectFormat(value: string) {
    setFormat(value);
    setError("");
  }

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
          <button
            onClick={() => {
              setActiveDocumentId(null);
              setIdea("");
              setFormat("Blog post");
              setContent("");
              setContentHistory([]);
              setHistoryIndex(-1);
              setEditing(false);
              setError("");
              setCopied(false);
              setSaveStatus("saved");
              setMenuOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
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
                onChange={(event) => {
                  setIdea(event.target.value);
                  setError("");
                }}
                placeholder="What do you want to write about?"
                className="min-h-[120px] w-full resize-none bg-transparent p-4 text-sm text-white outline-none placeholder:text-slate-500"
              />

              <div className="flex flex-col gap-2 border-t border-white/10 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {["Blog post", "Social post", "Video script"].map((item) => (
                    <button
                      key={item}
                      onClick={() => selectFormat(item)}
                      className={`rounded-lg px-3 py-2 text-xs font-medium ${
                        format === item
                          ? "bg-white text-slate-950"
                          : "text-slate-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {item}
                    </button>
                  ))}

                  <select
                    value={tone}
                    onChange={(event) => setTone(event.target.value)}
                    disabled={loading}
                    className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium text-white outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {["Professional", "Friendly", "Persuasive", "Casual", "Creative"].map(
                      (item) => (
                        <option key={item} value={item} className="text-slate-950">
                          {item}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <button
                  onClick={generateContent}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-950" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>

              {loading && (
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  SparkWriter is writing your draft...
                </div>
              )}

              {error && (
                <div className="mt-3 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                  {error}
                </div>
              )}
            </div>
          </section>

          {content && (
            <section className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Generated content</h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Your AI-generated {format.toLowerCase()}.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 text-xs">
                  <span className="text-slate-400">
                    {content.trim().split(/\\s+/).filter(Boolean).length} words
                    <span className="mx-2 text-slate-300">·</span>
                    {content.length} characters
                    <span className="mx-2 text-slate-300">·</span>
                    {Math.max(
                      1,
                      Math.ceil(
                        content.trim().split(/\\s+/).filter(Boolean).length / 200,
                      ),
                    )} min read
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 font-medium ${
                      saveStatus === "saving"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {saveStatus === "saving" ? "Saving..." : "Saved"}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                {editing ? (
                  <div className="p-5 sm:p-8">
                    <textarea
                      value={content}
                      onChange={(event) =>
                        updateContentWithHistory(event.target.value)
                      }
                      className="min-h-[500px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white"
                      placeholder="Write or edit your content here..."
                      spellCheck
                    />

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs">
                        <span
                          className={
                            saveStatus === "saving"
                              ? "text-amber-600"
                              : "text-emerald-600"
                          }
                        >
                          {saveStatus === "saving"
                            ? "Saving..."
                            : "Saved ✓"}
                        </span>

                        <span className="hidden text-slate-400 sm:inline">
                          Your changes are tracked by Undo and Redo.
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          saveDocument(content, format, activeDocumentId);
                          setEditing(false);
                        }}
                        className="rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white"
                      >
                        Save changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <article className="prose prose-slate max-w-none p-5 sm:p-8">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content}
                    </ReactMarkdown>
                  </article>
                )}

                <div className="flex flex-wrap gap-2 border-t border-slate-100 p-5">
                  <button
                    onClick={undoContent}
                    disabled={historyIndex <= 0 || !!actionLoading}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ↶ Undo
                  </button>

                  <button
                    onClick={redoContent}
                    disabled={
                      historyIndex < 0 ||
                      historyIndex >= contentHistory.length - 1 ||
                      !!actionLoading
                    }
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ↷ Redo
                  </button>

                  <button
                    onClick={copyContent}
                    disabled={!!actionLoading}
                    className="rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    {copied ? "Copied ✓" : "Copy content"}
                  </button>

                  <button
                    onClick={downloadContent}
                    disabled={!!actionLoading}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Download TXT
                  </button>

                  <button
                    onClick={downloadMarkdown}
                    disabled={!!actionLoading}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Download Markdown
                  </button>

                  {["Improve", "Shorten", "Expand", "Rewrite"].map((action) => (
                    <button
                      key={action}
                      onClick={() => runWritingAction(action)}
                      disabled={!!actionLoading || loading}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {actionLoading === action ? "Working..." : action}
                    </button>
                  ))}

                  <button
                    onClick={() => setEditing((current) => !current)}
                    disabled={!!actionLoading}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50"
                  >
                    {editing ? "Preview" : "Edit"}
                  </button>

                  <button
                    onClick={generateContent}
                    disabled={loading}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50"
                  >
                    {loading ? "Generating..." : "Regenerate"}
                  </button>
                </div>
              </div>
            </section>
          )}

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
                    onClick={() => selectFormat(item.title)}
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

              <div className="flex items-center gap-2">
                <input
                  value={documentSearch}
                  onChange={(event) => setDocumentSearch(event.target.value)}
                  placeholder="Search documents..."
                  className="w-40 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-slate-400 sm:w-52"
                />

                <button
                  onClick={() => setDocumentSearch("")}
                  disabled={!documentSearch}
                  className="text-xs font-semibold text-slate-500 disabled:opacity-30"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {savedDocuments
                .filter((document) => {
                  const query = documentSearch.trim().toLowerCase();

                  if (!query) return true;

                  return (
                    document.title.toLowerCase().includes(query) ||
                    document.type.toLowerCase().includes(query)
                  );
                })
                .map((document, index) => (
                <div
                  key={`${document.title}-${document.time}-${index}`}
                  className={`flex items-center gap-3 px-4 py-4 sm:px-5 ${
                    index !== savedDocuments.length - 1
                      ? "border-b border-slate-100"
                      : ""
                  }`}
                >
                  <button
                    onClick={() => {
                      setActiveDocumentId(document.id);
                      setContent(document.content || "");
                      setFormat(document.type);
                      setIdea(document.title);
                      setError("");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex min-w-0 flex-1 items-center gap-4 text-left hover:bg-slate-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                      <FileText size={17} />
                    </div>

                    <div className="min-w-0 flex-1">
                      {renamingDocumentId === document.id ? (
                        <input
                          autoFocus
                          value={renameTitle}
                          onChange={(event) =>
                            setRenameTitle(event.target.value)
                          }
                          onClick={(event) => event.stopPropagation()}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              saveRenamedDocument(document.id);
                            }

                            if (event.key === "Escape") {
                              event.preventDefault();
                              cancelRenamingDocument();
                            }
                          }}
                          className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-semibold outline-none focus:border-slate-500"
                          maxLength={80}
                        />
                      ) : (
                        <p className="truncate text-sm font-semibold">
                          {document.title}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-slate-400">
                        {document.type} · {document.time}
                      </p>
                    </div>

                    <ArrowRight size={16} className="text-slate-300" />
                  </button>

                  {renamingDocumentId === document.id ? (
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          saveRenamedDocument(document.id);
                        }}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-slate-100"
                      >
                        Save
                      </button>

                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          cancelRenamingDocument();
                        }}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 transition hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          startRenamingDocument(document);
                        }}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        title="Rename document"
                      >
                        Rename
                      </button>

                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteDocument(document.id);
                        }}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        title="Delete document"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
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

function createDemoContent(idea: string, format: string) {
  const title = idea.trim();

  if (format === "Social post") {
    return `${title}

The way we create, work, and communicate is changing quickly. AI gives creators and businesses new tools to brainstorm ideas, create drafts, save time, and reach their audience more effectively.

The key is not to let AI replace your creativity. Use it as a tool that helps you turn your ideas into better content, faster.

What is one way you would use AI to improve your work?`;
  }

  if (format === "Video script") {
    return `HOOK

What if you could turn your idea about "${title}" into useful content faster?

INTRODUCTION

Today, we're looking at ${title} and why it matters.

MAIN POINT

AI and modern digital tools are changing how people create, work, and share information. They can help with brainstorming, research, first drafts, editing, and repurposing content.

But technology works best when it supports human creativity. Your experience, ideas, opinions, and personal voice are what make the final content unique.

PRACTICAL TAKEAWAY

Start with your own idea, use technology to speed up the repetitive work, then review and improve the result before publishing.

ENDING

The future belongs to people who know how to combine their creativity with powerful tools. What will you create next?`;
  }

  return `# ${title}

## Introduction

${title} is an important topic in today's rapidly changing digital world. New technologies and ideas are creating opportunities for individuals, creators, and businesses to work more efficiently and reach more people.

## Why It Matters

Understanding ${title} can help people make better decisions, discover new opportunities, and adapt to changes in the way we work and communicate.

## Key Opportunities

One of the biggest opportunities is the ability to save time and improve productivity. Instead of spending all of their time on repetitive tasks, people can focus more on strategy, creativity, problem-solving, and building relationships.

## Practical Ways to Get Started

Start with a clear goal. Identify the tasks that take the most time, experiment with tools that can make those tasks easier, and always review the results before using them publicly.

## The Human Element

Technology can provide powerful assistance, but human judgment remains essential. Experience, creativity, context, and personal perspective help turn basic information into something genuinely valuable.

## Conclusion

${title} will continue to evolve as technology and society change. The people who learn how to use new tools thoughtfully will be better positioned to take advantage of future opportunities while maintaining their own creativity and voice.`;
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
