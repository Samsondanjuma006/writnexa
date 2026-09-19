import { NextResponse } from "next/server";
import OpenAI from "openai";

import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 25 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "You must be signed in to generate captions." },
        { status: 401 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Caption generation is not configured yet." },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please upload a video file." },
        { status: 400 },
      );
    }

    if (
      !file.type.startsWith("video/") &&
      !file.type.startsWith("audio/")
    ) {
      return NextResponse.json(
        { error: "Please upload a valid video or audio file." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error:
            "This video is larger than 25 MB. Please use a smaller video for automatic captions.",
        },
        { status: 413 },
      );
    }

    const openai = new OpenAI({
      apiKey,
    });

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["segment"],
    });

    const segments = (transcription.segments ?? [])
      .map((segment, index) => ({
        id: index,
        start: Number(segment.start ?? 0),
        end: Number(segment.end ?? 0),
        text: String(segment.text ?? "").trim(),
      }))
      .filter(
        (segment) =>
          segment.text &&
          Number.isFinite(segment.start) &&
          Number.isFinite(segment.end) &&
          segment.end > segment.start,
      );

    return NextResponse.json({
      segments,
    });
  } catch (error) {
    console.error("Caption generation failed:", error);

    return NextResponse.json(
      {
        error:
          "We couldn't generate captions for this video. Please try again.",
      },
      { status: 500 },
    );
  }
}
