import { NextRequest, NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

export async function POST(req: NextRequest) {
  if (!ELEVENLABS_API_KEY) {
    return NextResponse.json(
      { error: "ElevenLabs API key not configured" },
      { status: 500 },
    );
  }

  const formData = await req.formData();
  const audio = formData.get("audio");

  if (!audio || !(audio instanceof Blob)) {
    return NextResponse.json({ error: "Missing audio file" }, { status: 400 });
  }

  const body = new FormData();
  body.append("file", audio, "audio.webm");
  body.append("model_id", "scribe_v1");
  body.append("language_code", "en");

  const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: { "xi-api-key": ELEVENLABS_API_KEY },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("ElevenLabs STT error:", response.status, errorText);
    return NextResponse.json(
      { error: "Speech-to-text failed" },
      { status: response.status },
    );
  }

  const result = await response.json();
  return NextResponse.json({ text: result.text ?? "" });
}
