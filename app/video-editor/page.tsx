"use client";

import { useEffect, useRef, useState } from "react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [splitPoints, setSplitPoints] = useState<number[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  function handleVideoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please select a video file.");
      return;
    }

    if (videoUrl) URL.revokeObjectURL(videoUrl);

    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setFileName(file.name);
    setDuration(0);
    setCurrentTime(0);
    setTrimStart(0);
    setTrimEnd(0);
    setSplitPoints([]);
  }

  function handleLoadedMetadata(
    event: React.SyntheticEvent<HTMLVideoElement>
  ) {
    const nextDuration = event.currentTarget.duration;
    setDuration(nextDuration);
    setTrimStart(0);
    setTrimEnd(nextDuration);
  }

  function formatTime(seconds: number) {
    if (!Number.isFinite(seconds)) return "00:00";

    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  function updateTrimStart(value: number) {
    const maxStart = Math.max(trimEnd - 0.1, 0);
    const nextStart = Math.max(0, Math.min(value, maxStart));
    setTrimStart(nextStart);
    setSplitPoints((points) =>
      points.filter(
        (point) => point >= nextStart && point <= trimEnd
      )
    );

    if (videoRef.current && videoRef.current.currentTime < nextStart) {
      videoRef.current.currentTime = nextStart;
      setCurrentTime(nextStart);
    }
  }

  function updateTrimEnd(value: number) {
    const minEnd = Math.min(trimStart + 0.1, duration);
    const nextEnd = Math.min(duration, Math.max(value, minEnd));
    setTrimEnd(nextEnd);
    setSplitPoints((points) =>
      points.filter(
        (point) => point >= trimStart && point <= nextEnd
      )
    );

    if (videoRef.current && videoRef.current.currentTime > nextEnd) {
      videoRef.current.currentTime = nextEnd;
      setCurrentTime(nextEnd);
    }
  }

  function resetTrim() {
    setTrimStart(0);
    setTrimEnd(duration);
    setSplitPoints([]);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  }

  function splitAtPlayhead() {
    if (!videoUrl || !duration) return;

    const point = Math.max(trimStart, Math.min(currentTime, trimEnd));

    if (
      point <= trimStart + 0.05 ||
      point >= trimEnd - 0.05 ||
      splitPoints.some(
        (existingPoint) => Math.abs(existingPoint - point) < 0.1
      )
    ) {
      return;
    }

    setSplitPoints((points) =>
      [...points, point].sort((a, b) => a - b)
    );
  }

  function removeSplitPoint(point: number) {
    setSplitPoints((points) =>
      points.filter(
        (existingPoint) => Math.abs(existingPoint - point) >= 0.1
      )
    );
  }

  function openVideoPicker() {
    fileInputRef.current?.click();
  }

  function seekTimeline(event: React.MouseEvent<HTMLDivElement>) {
    if (!videoRef.current || !duration) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const position = Math.max(
      0,
      Math.min(event.clientX - rect.left, rect.width)
    );
    const requestedTime = (position / rect.width) * duration;
    const nextTime = Math.max(
      trimStart,
      Math.min(requestedTime, trimEnd || duration)
    );

    videoRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function handleTimeUpdate(
    event: React.SyntheticEvent<HTMLVideoElement>
  ) {
    const time = event.currentTarget.currentTime;

    if (trimEnd > trimStart && time >= trimEnd) {
      event.currentTarget.currentTime = trimStart;
      setCurrentTime(trimStart);
      return;
    }

    setCurrentTime(time);
  }

  return (
    <main className="min-h-screen bg-[#f7f7f8] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="hidden"
        />

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
              <button
                type="button"
                onClick={openVideoPicker}
                className="mt-4 w-full rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                Upload video
              </button>
            </div>
          </aside>

          <section className="flex min-w-0 flex-col p-4 lg:p-6">
            <div className="flex flex-1 items-center justify-center rounded-3xl border border-slate-200 bg-slate-950 p-5 shadow-sm">
              <div className="relative flex aspect-video w-full max-w-4xl items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-black">
                {videoUrl ? (
                  <video
                    ref={videoRef}
                    key={videoUrl}
                    src={videoUrl}
                    controls
                    playsInline
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={handleTimeUpdate}
                    className="h-full w-full rounded-2xl object-contain"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(139,92,246,0.25),transparent_45%)]" />

                    <div className="relative px-6 text-center text-white">
                      <button
                        type="button"
                        onClick={openVideoPicker}
                        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur transition hover:bg-white/20"
                      >
                        <Play size={25} fill="currentColor" />
                      </button>

                      <p className="mt-4 text-sm font-semibold">
                        Your video preview
                      </p>
                      <p className="mt-1 text-xs text-white/50">
                        Upload a video to begin
                      </p>

                      <button
                        type="button"
                        onClick={openVideoPicker}
                        className="mt-5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-slate-100"
                      >
                        Upload video
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold">Timeline</p>
                  <p className="truncate text-xs text-slate-500">
                    {fileName
                      ? fileName
                      : "Arrange clips, captions and audio"}
                  </p>
                </div>
                <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div
                onClick={seekTimeline}
                className="relative h-24 cursor-pointer overflow-hidden rounded-xl bg-slate-50"
              >
                <div className="absolute left-0 right-0 top-1/2 h-px bg-slate-200" />

                <div className="absolute inset-x-4 top-3 flex justify-between text-[10px] text-slate-400">
                  <span>00:00</span>
                  <span>{formatTime(duration * 0.25)}</span>
                  <span>{formatTime(duration * 0.5)}</span>
                  <span>{formatTime(duration * 0.75)}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                {videoUrl && duration > 0 && (
                  <>
                    <div className="absolute inset-x-4 bottom-3 h-10 overflow-hidden rounded-lg border border-slate-300 bg-slate-200">
                      <div className="h-full bg-gradient-to-r from-violet-400/70 via-blue-400/60 to-emerald-400/60" />

                      <div
                        className="absolute bottom-0 top-0 border-2 border-violet-500 bg-violet-500/10"
                        style={{
                          left: `${(trimStart / duration) * 100}%`,
                          right: `${100 - (trimEnd / duration) * 100}%`,
                        }}
                      />
                    </div>

                    {splitPoints.map((point) => (
                      <button
                        key={point}
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          removeSplitPoint(point);
                        }}
                        className="absolute bottom-2 top-9 z-20 w-0.5 bg-amber-500"
                        style={{
                          left: `calc(16px + ((100% - 32px) * ${
                            point / duration
                          }))`,
                        }}
                        title={`Remove split at ${formatTime(point)}`}
                        aria-label={`Remove split at ${formatTime(point)}`}
                      />
                    ))}

                    <div
                      className="absolute bottom-2 top-1 z-10 w-0.5 bg-violet-600"
                      style={{
                        left: `calc(16px + ((100% - 32px) * ${
                          currentTime / duration
                        }))`,
                      }}
                    >
                      <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-violet-600 shadow-sm" />
                    </div>
                  </>
                )}
                {!videoUrl && (
                  <div className="absolute inset-x-4 bottom-3 flex h-10 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-400">
                    Upload a video to activate the timeline
                  </div>
                )}
              </div>

              {videoUrl && duration > 0 && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold">Trim & split</p>
                      <p className="text-xs text-slate-500">
                        Select the portion you want to keep and add split points at the playhead.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={resetTrim}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      Reset trim
                    </button>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold">
                        <span>Trim start</span>
                        <span className="text-slate-500">{formatTime(trimStart)}</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={duration}
                        step={0.1}
                        value={trimStart}
                        onChange={(event) =>
                          updateTrimStart(Number(event.target.value))
                        }
                        className="w-full accent-violet-600"
                      />
                    </label>

                    <label className="block">
                      <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold">
                        <span>Trim end</span>
                        <span className="text-slate-500">{formatTime(trimEnd)}</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={duration}
                        step={0.1}
                        value={trimEnd}
                        onChange={(event) =>
                          updateTrimEnd(Number(event.target.value))
                        }
                        className="w-full accent-violet-600"
                      />
                    </label>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-slate-500">
                      Selected clip:{" "}
                      <span className="font-semibold text-slate-700">
                        {formatTime(Math.max(0, trimEnd - trimStart))}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={splitAtPlayhead}
                      disabled={
                        currentTime <= trimStart + 0.05 ||
                        currentTime >= trimEnd - 0.05
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Scissors className="h-3.5 w-3.5" />
                      Split at playhead
                    </button>
                  </div>

                  {splitPoints.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {splitPoints.map((point) => (
                        <button
                          key={point}
                          type="button"
                          onClick={() => removeSplitPoint(point)}
                          className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                          title="Remove split point"
                        >
                          Split {formatTime(point)} ×
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
