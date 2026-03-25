import { NextRequest } from "next/server";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.swiftagents.org"
).replace(/\/$/, "");

export async function POST(req: NextRequest) {
  const { company_id, session_id, message } = await req.json();

  const upstream = await fetch(
    `${API_BASE_URL}/api/v1/chat/${company_id}/chat`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, message }),
    },
  );

  if (!upstream.ok || !upstream.body) {
    return new Response(upstream.statusText, { status: upstream.status });
  }

  // Stream the SSE response through to the client
  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
