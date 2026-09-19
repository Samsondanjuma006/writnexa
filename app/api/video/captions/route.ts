import { NextResponse } from "next/server";
import OpenAI from "openai";

import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const BUCKET_NAME = "video-captions";

type CaptionSegment = {
  id: number;
  start: number;
  end: number;
  text: string;
};

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

    const body = await request.json();
    const storagePath =
      typeof body.storagePath === "string" ? body.storagePath : "";

    if (!storagePath) {
      return NextResponse.json(
        { error: "No uploaded video was provided." },
        { status: 400 },
      );
    }

    const expectedPrefix = `${user.id}/`;

    if (!storagePath.startsWith(expectedPrefix)) {
      return NextResponse.json(
        { error: "You can only generate captions for your own videos." },
        { status: 403 },
      );
    }

    const { data: fileData, error: downloadError } = await supabase.storage
      .from(BUCKET_NAME)
      .download(storagePath);

    if (downloadError || !fileData) {
      console.error("Caption video download failed:", downloadError);

      return NextResponse.json(
        { error: "We couldn't access the uploaded video." },
        { status: 400 },
      );
    }

    if (fileData.size > MAX_FILE_SIZE) {
      await supabase.storage.from(BUCKET_NAME).remove([storagePath]);

      return NextResponse.json(
        {
          error:
            "This video is larger than 25 MB. Please use a smaller video for automatic captions.",
        },
        { status: 413 },
      );
    }

    const fileName =
      storagePath.split("/").pop() || "writnexa-video.mp4";

    const videoFile = new File([fileData], fileName, {
      type: fileData.type || "video/mp4",
    });

    const openai = new OpenAI({
      apiKey,
    });

    const transcription = await openai.audio.transcriptions.create({
      file: videoFile,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["segment"],
    });

    const segments: CaptionSegment[] = (transcription.segments ?? [])
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

    await supabase.storage.from(BUCKET_NAME).remove([storagePath]);

    return NextResponse.json({
      segments,
    });
  } catch (error) {
    console.error("Caption generation failed:", error);

    const errorMessage =
      error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        error: `Caption generation failed: ${errorMessage}`,
      },
      { status: 500 },
    );
  }
}
