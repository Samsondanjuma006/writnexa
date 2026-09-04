"use client";

import {
  ArrowLeft,
  CalendarDays,
  FileText,
  LogOut,
  Mail,
  Settings,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AccountPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [documentCount, setDocumentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAccount() {
      try {
        setLoading(true);
        setError("");

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          window.location.href = "/login";
          return;
        }

        setEmail(user.email || "");

        if (user.created_at) {
          setCreatedAt(
            new Date(user.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          );
        }

        const { count, error: documentsError } = await supabase
          .from("documents")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);

        if (documentsError) {
          console.error(
            "Unable to load document usage:",
            documentsError,
          );
        } else {
          setDocumentCount(count ?? 0);
        }
      } catch (err) {
        console.error("Unable to load account:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your account.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, []);

  async function handleLogout() {
    try {
      setSigningOut(true);
      await supabase.auth.signOut();
      window.location.href = "/login";
    } catch (err) {
      console.error("Unable to sign out:", err);
      setError("Unable to sign out. Please try again.");
      setSigningOut(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
          >
            <ArrowLeft size={17} />
            Back to dashboard
          </a>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Sparkles size={17} />
            </div>
            <span className="font-semibold tracking-tight">Writnexa</span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold text-slate-500">Account</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Your Writnexa account
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage your account information, plan, and Writnexa usage.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <Mail size={20} />
              </div>
              <div>
                <h2 className="font-semibold">Account information</h2>
                <p className="text-sm text-slate-500">
                  Your Writnexa account details.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Email address
                </p>
                <p className="mt-2 break-all text-sm font-medium">
                  {loading ? "Loading..." : email || "Not available"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  <CalendarDays size={15} className="text-slate-400" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Member since
                  </p>
                </div>
                <p className="mt-2 text-sm font-medium">
                  {loading ? "Loading..." : createdAt || "Not available"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="font-semibold">Current plan</h2>
                <p className="text-sm text-slate-500">Your Writnexa plan.</p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-lg font-bold">Free plan</p>
              <p className="mt-1 text-sm text-slate-500">
                You are currently using the free Writnexa plan.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="font-semibold">Usage</h2>
                <p className="text-sm text-slate-500">
                  Your saved Writnexa documents.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">
                  Saved documents
                </span>
                <span className="text-sm text-slate-500">
                  {loading ? "..." : documentCount}
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-slate-900 transition-all"
                  style={{
                    width: `${Math.min(
                      (documentCount / 50) * 100,
                      100,
                    )}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                {documentCount} of 50 saved documents
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="font-semibold">Account actions</h2>
            <p className="mt-1 text-sm leading-5 text-slate-500">
              Manage your preferences or sign out of this device.
            </p>

            <div className="mt-5 space-y-3">
              <a
                href="/settings"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold transition hover:bg-slate-50"
              >
                <Settings size={16} />
                Settings
              </a>

              <button
                type="button"
                onClick={handleLogout}
                disabled={signingOut}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut size={16} />
                {signingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
