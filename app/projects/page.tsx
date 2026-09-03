"use client";

import {
  ArrowLeft,
  FolderOpen,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Project = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export default function ProjectsPage() {
  const supabase = createClient();

  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProjects() {
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

        const { data, error: projectsError } = await supabase
          .from("projects")
          .select("id, name, description, created_at, updated_at")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false });

        if (projectsError) throw projectsError;

        setProjects(data || []);
      } catch (err) {
        console.error("Unable to load projects:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your projects.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  async function createProject() {
    const trimmedName = name.trim();

    if (!trimmedName) return;

    try {
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

      const { data, error: createError } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: trimmedName,
          description: description.trim(),
        })
        .select("id, name, description, created_at, updated_at")
        .single();

      if (createError) throw createError;

      setProjects((current) => [data, ...current]);
      setName("");
      setDescription("");
      setShowCreateForm(false);
    } catch (err) {
      console.error("Unable to create project:", err);

      const message =
        err && typeof err === "object" && "message" in err
          ? String(err.message)
          : err instanceof Error
            ? err.message
            : "Unable to create your project.";

      setError(message);
    }
  }

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
              Your projects
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Organize your writing into projects.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-bold text-white hover:bg-slate-800"
          >
            <Plus size={16} />
            New project
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {showCreateForm && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Create project</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Give your project a name and optional description.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Project name
                </label>

                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. YouTube channel"
                  autoFocus
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What is this project about?"
                  rows={3}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={createProject}
                  disabled={!name.trim()}
                  className="rounded-xl bg-slate-950 px-5 py-3 text-xs font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Create project
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
            Loading your projects...
          </div>
        ) : projects.length === 0 && !showCreateForm ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <FolderOpen size={25} className="text-slate-500" />
            </div>

            <h2 className="mt-5 text-lg font-bold">
              No projects yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create a project to organize your documents and keep related
              content together.
            </p>

            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-bold text-white hover:bg-slate-800"
            >
              <Plus size={16} />
              Create your first project
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <FolderOpen size={18} className="text-slate-600" />
                </div>

                <h2 className="mt-5 text-base font-bold">
                  {project.name}
                </h2>

                <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500">
                  {project.description || "No description."}
                </p>

                <div className="mt-5 border-t border-slate-100 pt-4 text-[11px] text-slate-400">
                  Updated{" "}
                  {new Date(project.updated_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
