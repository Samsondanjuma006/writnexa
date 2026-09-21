"use client";

import { FormEvent, useState } from "react";
import {
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";

type SupportMessage = {
  role: "user" | "assistant";
  content: string;
  feedback?: "up" | "down";
};

type WritnexaAISupportProps = {
  variant?: "full" | "floating";
};

const SUGGESTED_QUESTIONS = [
  "How do I create a blog post?",
  "How do I use the Video Editor?",
  "Where are my saved documents?",
  "How do I change my writing preferences?",
];

export default function WritnexaAISupport({
  variant = "full",
}: WritnexaAISupportProps) {
  const [open, setOpen] = useState(variant === "full");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Writnexa AI Support. I can help you use Writnexa, troubleshoot common problems, and find the right feature. What can I help you with?",
    },
  ]);

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();

    const message = input.trim();

    if (!message || loading) {
      return;
    }

    const history = messages.map(({ role, content }) => ({
      role,
      content,
    }));

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: message,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          messages: history,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Writnexa AI Support is temporarily unavailable.",
        );
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.content,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Writnexa AI Support is temporarily unavailable. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function updateFeedback(index: number, feedback: "up" | "down") {
    setMessages((current) =>
      current.map((message, messageIndex) =>
        messageIndex === index
          ? {
              ...message,
              feedback:
                message.feedback === feedback ? undefined : feedback,
            }
          : message,
      ),
    );
  }

  function askSuggestedQuestion(question: string) {
    setInput(question);
  }

  if (variant === "floating") {
    return (
      <>
        {open && (
          <div className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <SupportChat
              messages={messages}
              input={input}
              loading={loading}
              onInputChange={setInput}
              onSubmit={sendMessage}
              onFeedback={updateFeedback}
              onSuggestedQuestion={askSuggestedQuestion}
              compact
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
          aria-label="Open Writnexa AI Support"
        >
          {open ? <X size={18} /> : <MessageCircle size={18} />}
          <span className="hidden sm:inline">
            Writnexa AI Support
          </span>
          <span className="sm:hidden">AI Support</span>
        </button>
      </>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <SupportChat
        messages={messages}
        input={input}
        loading={loading}
        onInputChange={setInput}
        onSubmit={sendMessage}
        onFeedback={updateFeedback}
        onSuggestedQuestion={askSuggestedQuestion}
      />
    </div>
  );
}

type SupportChatProps = {
  messages: SupportMessage[];
  input: string;
  loading: boolean;
  compact?: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (event?: FormEvent) => void;
  onFeedback: (index: number, feedback: "up" | "down") => void;
  onSuggestedQuestion: (question: string) => void;
};

function SupportChat({
  messages,
  input,
  loading,
  compact = false,
  onInputChange,
  onSubmit,
  onFeedback,
  onSuggestedQuestion,
}: SupportChatProps) {
  return (
    <div className="flex max-h-[min(720px,80vh)] flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Sparkles size={17} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Writnexa AI Support
            </h2>
            <p className="text-xs text-slate-500">
              AI support for Writnexa
            </p>
          </div>
        </div>

        {compact && (
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={
              message.role === "user"
                ? "flex justify-end"
                : "flex justify-start"
            }
          >
            <div
              className={
                message.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-br-md bg-slate-900 px-4 py-3 text-sm text-white"
                  : "max-w-[90%] rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm leading-6 text-slate-800"
              }
            >
              <p className="whitespace-pre-wrap">{message.content}</p>

              {message.role === "assistant" && index > 0 && (
                <div className="mt-3 flex items-center gap-1 border-t border-slate-200 pt-2">
                  <span className="mr-1 text-[11px] text-slate-400">
                    Helpful?
                  </span>

                  <button
                    type="button"
                    onClick={() => onFeedback(index, "up")}
                    className={`rounded-md p-1.5 transition ${
                      message.feedback === "up"
                        ? "bg-emerald-100 text-emerald-700"
                        : "text-slate-400 hover:bg-white hover:text-slate-700"
                    }`}
                    aria-label="Yes, this was helpful"
                  >
                    <ThumbsUp size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onFeedback(index, "down")}
                    className={`rounded-md p-1.5 transition ${
                      message.feedback === "down"
                        ? "bg-red-100 text-red-700"
                        : "text-slate-400 hover:bg-white hover:text-slate-700"
                    }`}
                    aria-label="No, this was not helpful"
                  >
                    <ThumbsDown size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm text-slate-500">
              <Loader2 size={15} className="animate-spin" />
              Writnexa AI Support is thinking…
            </div>
          </div>
        )}
      </div>

      {messages.length === 1 && (
        <div className="border-t border-slate-100 px-4 pb-2 pt-3">
          <p className="mb-2 text-xs font-medium text-slate-500">
            Try asking:
          </p>

          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => onSuggestedQuestion(question)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="border-t border-slate-200 bg-white p-3"
      >
        <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 focus-within:border-slate-400">
          <textarea
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder="Ask Writnexa AI Support..."
            rows={1}
            disabled={loading}
            className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();

                if (!loading && input.trim()) {
                  onSubmit();
                }
              }
            }}
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send support question"
          >
            <Send size={17} />
          </button>
        </div>

        <p className="mt-2 text-center text-[11px] text-slate-400">
          Writnexa AI Support is an AI assistant, not a human support agent.
        </p>
      </form>
    </div>
  );
}
