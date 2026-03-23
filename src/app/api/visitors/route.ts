import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

export async function POST(req: NextRequest) {
  const { company_id, ip_address } = await req.json();

  const upstream = await fetch(
    `${API_BASE_URL}/api/v1/dashboard/${company_id}/visitors/log`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ip_address }),
    },
  );

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "Failed to log visitor" },
      { status: upstream.status },
    );
  }

  return NextResponse.json({ ok: true });
}
