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
    // Forward the upstream body (e.g. the 402 plan-limit detail) and its
    // content type so the client can read the message, not just the status.
    const body = await upstream.text();
    return new Response(body || upstream.statusText, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ?? "text/plain",
      },
    });
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
