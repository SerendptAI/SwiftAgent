import { NextRequest, NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID =
  process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Default: Rachel

export async function POST(req: NextRequest) {
  if (!ELEVENLABS_API_KEY) {
    return NextResponse.json(
      { error: "ElevenLabs API key not configured" },
      { status: 500 },
    );
  }

  const { text } = await req.json();

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Missing text field" }, { status: 400 });
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("ElevenLabs API error:", response.status, errorText);
    return NextResponse.json(
      { error: "TTS generation failed" },
      { status: response.status },
    );
  }

  const audioBuffer = await response.arrayBuffer();

  return new NextResponse(audioBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-cache",
    },
  });
}
