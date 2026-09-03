"use client";

import {
  ArrowLeft,
  FileText,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Document = {
  id: string;
  title: string;
  type: string;
  tone: string;
  idea: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export default function DocumentsPage() {
  const supabase = createClient();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDocuments() {
      try {
        setLoading(true);
        setError("");

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          window.location.href = "/login";
          return;
        }

        const { data, error: documentsError } = await supabase
          .from("documents")
          .select(
            "id, title, type, tone, idea, content, created_at, updated_at",
          )
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false });

        if (documentsError) throw documentsError;

        setDocuments(data || []);
      } catch (err) {
        console.error("Unable to load documents:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your documents.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, []);

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return documents;

    return documents.filter((document) =>
      [
        document.title,
        document.type,
        document.tone,
        document.idea,
        document.content,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [documents, search]);

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Sparkles size={19} />
            </div>

            <div>
              <div className="text-[17px] font-bold">Writnexa</div>
              <div className="text-[11px] text-slate-400">
                AI writing studio
              </div>
            </div>
          </a>

          <a
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50"
          >
            <ArrowLeft size={15} />
            Dashboard
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Workspace
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Your documents
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Everything you have created with Writnexa.
            </p>
          </div>

          <a
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-bold text-white hover:bg-slate-800"
          >
            <Plus size={16} />
            New document
          </a>
        </div>

        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <Search size={18} className="text-slate-400" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search your documents..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
            Loading your documents...
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <FileText size={24} className="text-slate-500" />
            </div>

            <h2 className="mt-5 text-lg font-bold">
              {search ? "No documents found" : "No documents yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {search
                ? "Try another search term."
                : "Create your first piece of content and it will appear here."}
            </p>

            {!search && (
              <a
                href="/dashboard"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-bold text-white"
              >
                <Plus size={16} />
                Create your first document
              </a>
            )}
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.map((document) => (
              <a
                key={document.id}
                href={`/dashboard?document=${encodeURIComponent(document.id)}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <FileText size={18} className="text-slate-600" />
                  </div>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                    {document.type}
                  </span>
                </div>

                <h2 className="mt-5 line-clamp-2 text-base font-bold group-hover:text-slate-600">
                  {document.title || "Untitled document"}
                </h2>

                <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500">
                  {document.content || document.idea || "No content yet."}
                </p>

                <div className="mt-5 border-t border-slate-100 pt-4 text-[11px] text-slate-400">
                  Updated{" "}
                  {new Date(document.updated_at).toLocaleDateString()}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
