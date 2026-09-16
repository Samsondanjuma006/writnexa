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

type Folder = {
  id: string;
  name: string;
};

type Document = {
  id: string;
  title: string;
  type: string;
  tone: string;
  idea: string;
  content: string;
  created_at: string;
  updated_at: string;
  folder_id: string | null;
};

export default function DocumentsPage() {
  const supabase = createClient();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [movingDocumentId, setMovingDocumentId] = useState<string | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState("");
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

        const [
          { data: documentData, error: documentsError },
          { data: folderData, error: foldersError },
        ] = await Promise.all([
          supabase
            .from("documents")
            .select(
              "id, title, type, tone, idea, content, created_at, updated_at, folder_id",
            )
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false }),
          supabase
            .from("document_folders")
            .select("id, name")
            .eq("user_id", user.id)
            .order("created_at", { ascending: true }),
        ]);

        if (documentsError) throw documentsError;
        if (foldersError) throw foldersError;

        setDocuments(documentData || []);
        setFolders(folderData || []);
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

  async function deleteFolder(folderId: string) {
    try {
      setError("");

      const { error: folderError } = await supabase
        .from("document_folders")
        .delete()
        .eq("id", folderId);

      if (folderError) throw folderError;

      setFolders((current) =>
        current.filter((folder) => folder.id !== folderId),
      );

      if (selectedFolder === folderId) {
        setSelectedFolder(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete folder.");
    }
  }

  async function renameFolder(folderId: string) {
    const name = editingFolderName.trim();

    if (!name || editingFolderId !== folderId) return;

    try {
      setError("");

      const { data, error: folderError } = await supabase
        .from("document_folders")
        .update({ name })
        .eq("id", folderId)
        .select("id, name")
        .single();

      if (folderError) throw folderError;

      setFolders((current) =>
        current.map((folder) =>
          folder.id === folderId ? { ...folder, name: data.name } : folder,
        ),
      );

      setEditingFolderId(null);
      setEditingFolderName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rename folder.");
    }
  }

  async function moveDocument(documentId: string, folderId: string | null) {
    if (movingDocumentId) return;

    try {
      setMovingDocumentId(documentId);
      setError("");

      const { error: updateError } = await supabase
        .from("documents")
        .update({ folder_id: folderId })
        .eq("id", documentId);

      if (updateError) throw updateError;

      setDocuments((current) =>
        current.map((document) =>
          document.id === documentId
            ? { ...document, folder_id: folderId }
            : document,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to move document.");
    } finally {
      setMovingDocumentId(null);
    }
  }

  async function createFolder() {
    const name = newFolderName.trim();

    if (!name || creatingFolder) return;

    try {
      setCreatingFolder(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be signed in to create a folder.");
      }

      const { data, error: folderError } = await supabase
        .from("document_folders")
        .insert({
          user_id: user.id,
          name,
        })
        .select("id, name")
        .single();

      if (folderError) throw folderError;

      setFolders((current) => [...current, data]);
      setNewFolderName("");
      setSelectedFolder(data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create folder.");
    } finally {
      setCreatingFolder(false);
    }
  }

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (selectedFolder !== null) {
      return documents.filter((document) => {
        if (
          selectedFolder === "unfiled"
            ? document.folder_id !== null
            : document.folder_id !== selectedFolder
        ) {
          return false;
        }

        if (!query) return true;

        return [
          document.title,
          document.type,
          document.tone,
          document.idea,
          document.content,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      });
    }

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
  }, [documents, search, selectedFolder]);

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

        <div className="mt-4 flex flex-wrap gap-2">
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Folders
            </span>
            <input
              value={newFolderName}
              onChange={(event) => setNewFolderName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void createFolder();
                }
              }}
              placeholder="New folder name"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 sm:w-44"
              disabled={creatingFolder}
            />
            <button
              type="button"
              onClick={() => void createFolder()}
              disabled={!newFolderName.trim() || creatingFolder}
              className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creatingFolder ? "Creating..." : "Create folder"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSelectedFolder(null)}
            className={`rounded-xl px-3 py-2 text-xs font-semibold ${
              selectedFolder === null
                ? "bg-slate-950 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            All documents
          </button>

          <button
            type="button"
            onClick={() => setSelectedFolder("unfiled")}
            className={`rounded-xl px-3 py-2 text-xs font-semibold ${
              selectedFolder === "unfiled"
                ? "bg-slate-950 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Unfiled
          </button>

          {folders.map((folder) => (
            <div
              key={folder.id}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900"
            >
              {editingFolderId === folder.id ? (
                <>
                  <input
                    value={editingFolderName}
                    onChange={(event) => setEditingFolderName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void renameFolder(folder.id);
                      }

                      if (event.key === "Escape") {
                        setEditingFolderId(null);
                        setEditingFolderName("");
                      }
                    }}
                    autoFocus
                    className="w-32 rounded-lg bg-transparent px-2 py-1 text-xs font-semibold text-slate-700 outline-none dark:text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => void renameFolder(folder.id)}
                    className="rounded-lg px-2 py-1 text-[10px] font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingFolderId(null);
                      setEditingFolderName("");
                    }}
                    className="rounded-lg px-2 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      selectedFolder === folder.id
                        ? "bg-slate-950 text-white"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    {folder.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingFolderId(folder.id);
                      setEditingFolderName(folder.name);
                    }}
                    className="rounded-lg px-2 py-1 text-[10px] font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete "${folder.name}"? Documents in this folder will become unfiled.`,
                        )
                      ) {
                        void deleteFolder(folder.id);
                      }
                    }}
                    className="rounded-lg px-2 py-1 text-[10px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
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
              {search
                ? "No documents found"
                : selectedFolder !== null
                  ? selectedFolder === "unfiled"
                    ? "No unfiled documents"
                    : "No documents in this folder"
                  : "No documents yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {search
                ? "Try another search term."
                : selectedFolder !== null
                  ? "Create a document or move an existing document into this folder."
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
              <div
                key={document.id}
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

                <div className="mt-4">
                  <label className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Folder
                  </label>
                  <select
                    value={document.folder_id ?? ""}
                    onChange={(event) =>
                      void moveDocument(
                        document.id,
                        event.target.value || null,
                      )
                    }
                    disabled={movingDocumentId === document.id}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-slate-400 disabled:opacity-50"
                  >
                    <option value="">
                      {movingDocumentId === document.id
                        ? "Moving..."
                        : "Unfiled"}
                    </option>
                    {folders.map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-[11px] text-slate-400">
                    Updated{" "}
                    {new Date(document.updated_at).toLocaleDateString()}
                  </span>

                  <a
                    href={`/dashboard?document=${encodeURIComponent(document.id)}`}
                    className="text-[11px] font-bold text-slate-700 underline underline-offset-2 hover:text-slate-950"
                  >
                    Open
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
