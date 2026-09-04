"use client";

import {
  ArrowLeft,
  Check,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const formats = [
  "Blog post",
  "Social post",
  "Video script",
  "Professional email",
  "Business proposal",
  "Product announcement",
  "Rewrite",
];

const tones = [
  "Professional",
  "Friendly",
  "Persuasive",
  "Casual",
  "Creative",
];

export default function SettingsPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [format, setFormat] = useState("Blog post");
  const [tone, setTone] = useState("Professional");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
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

        const savedFormat = window.localStorage.getItem(
          "writnexa-default-format",
        );
        const savedTone = window.localStorage.getItem(
          "writnexa-default-tone",
        );

        if (savedFormat && formats.includes(savedFormat)) {
          setFormat(savedFormat);
        }

        if (savedTone && tones.includes(savedTone)) {
          setTone(savedTone);
        }
      } catch (err) {
        console.error("Unable to load settings:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your settings.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  function savePreferences() {
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      window.localStorage.setItem("writnexa-default-format", format);
      window.localStorage.setItem("writnexa-default-tone", tone);

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (err) {
      console.error("Unable to save settings:", err);
      setError("Unable to save your preferences on this device.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-4 sm:px-6">
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

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Settings
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your account and writing preferences.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
            Loading your settings...
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                  <Settings size={18} className="text-slate-600" />
                </div>

                <div>
                  <h2 className="text-base font-bold">Account</h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your Writnexa account information.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 px-4 py-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Email address
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {email}
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-base font-bold">Writing preferences</h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Choose the format and tone you want to use by default.
                </p>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-bold text-slate-700">
                    Default format
                  </span>

                  <select
                    value={format}
                    onChange={(event) => {
                      setFormat(event.target.value);
                      setSaved(false);
                    }}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-slate-400"
                  >
                    {formats.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-700">
                    Default tone
                  </span>

                  <select
                    value={tone}
                    onChange={(event) => {
                      setTone(event.target.value);
                      setSaved(false);
                    }}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-slate-400"
                  >
                    {tones.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
                <p className="text-xs text-slate-400">
                  Preferences are saved on this device.
                </p>

                <button
                  type="button"
                  onClick={savePreferences}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saved ? (
                    <>
                      <Check size={15} />
                      Saved
                    </>
                  ) : (
                    <>{saving ? "Saving..." : "Save preferences"}</>
                  )}
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-base font-bold">Account actions</h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Manage your current session.
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-4">
                <div>
                  <p className="text-sm font-semibold">Sign out</p>

                  <p className="mt-1 text-xs text-slate-500">
                    Sign out of Writnexa on this device.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
