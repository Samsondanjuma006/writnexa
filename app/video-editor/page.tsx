"use client";

import {
  Captions,
  ChevronDown,
  Download,
  Film,
  Mic2,
  Play,
  Scissors,
  Sparkles,
  Upload,
  WandSparkles,
} from "lucide-react";

export default function VideoEditorPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f8] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Film size={18} />
            </div>
            <div>
              <p className="text-sm font-bold">Writnexa Video Editor</p>
              <p className="text-[11px] text-slate-500">
                Create social-ready videos with AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Save project
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
              <Download size={16} />
              Export
              <ChevronDown size={15} />
            </button>
          </div>
        </header>

        <div className="grid flex-1 lg:grid-cols-[230px_minmax(0,1fr)_300px]">
          <aside className="hidden border-r border-slate-200 bg-white p-4 lg:block">
            <p className="px-2 pb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              AI tools
            </p>

            <div className="space-y-2">
              {[
                { icon: WandSparkles, label: "Smart edit" },
                { icon: Captions, label: "Auto captions" },
                { icon: Scissors, label: "Trim & split" },
                { icon: Mic2, label: "Clean audio" },
                { icon: Sparkles, label: "Enhance video" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <Upload size={20} className="text-slate-500" />
              <p className="mt-3 text-sm font-semibold">Add your video</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Upload a video to start editing with AI.
              </p>
              <button className="mt-4 w-full rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800">
                Upload video
              </button>
            </div>
          </aside>

          <section className="flex min-w-0 flex-col p-4 lg:p-6">
            <div className="flex flex-1 items-center justify-center rounded-3xl border border-slate-200 bg-slate-950 p-5 shadow-sm">
              <div className="relative flex aspect-video w-full max-w-4xl items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-black">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(139,92,246,0.25),transparent_45%)]" />

                <div className="relative text-center text-white">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur">
                    <Play size={25} fill="currentColor" />
                  </div>
                  <p className="mt-4 text-sm font-semibold">
                    Your video preview
                  </p>
                  <p className="mt-1 text-xs text-white/50">
                    Upload a video to begin
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Timeline</p>
                  <p className="text-xs text-slate-500">
                    Arrange clips, captions and audio
                  </p>
                </div>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                  00:00 / 00:00
                </span>
              </div>

              <div className="relative h-24 overflow-hidden rounded-xl bg-slate-50">
                <div className="absolute left-0 right-0 top-1/2 h-px bg-slate-200" />
                <div className="absolute inset-x-4 top-3 flex justify-between text-[10px] text-slate-400">
                  <span>00:00</span>
                  <span>00:05</span>
                  <span>00:10</span>
                  <span>00:15</span>
                  <span>00:20</span>
                </div>
                <div className="absolute inset-x-4 bottom-3 h-10 rounded-lg border border-dashed border-slate-300" />
              </div>
            </div>
          </section>

          <aside className="border-t border-slate-200 bg-white p-5 lg:border-l lg:border-t-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Quick actions
            </p>

            <div className="mt-3 space-y-3">
              <button className="w-full rounded-2xl border border-slate-200 p-4 text-left transition hover:border-slate-300 hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Captions size={17} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Generate captions</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Create synced subtitles automatically
                    </p>
                  </div>
                </div>
              </button>

              <button className="w-full rounded-2xl border border-slate-200 p-4 text-left transition hover:border-slate-300 hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <WandSparkles size={17} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Remove silence</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Tighten your video automatically
                    </p>
                  </div>
                </div>
              </button>

              <button className="w-full rounded-2xl border border-slate-200 p-4 text-left transition hover:border-slate-300 hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Sparkles size={17} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Enhance video</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Improve clarity and presentation
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-8 rounded-2xl bg-slate-950 p-4 text-white">
              <p className="text-xs font-bold">Social-ready export</p>
              <p className="mt-1 text-xs leading-5 text-white/60">
                Prepare your video for TikTok, Instagram, YouTube and other
                platforms.
              </p>

              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-slate-950">
                <Download size={15} />
                Export video
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
