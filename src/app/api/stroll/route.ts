import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.swiftagents.org"
).replace(/\/$/, "");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const companyId = body.company_id;

  if (!companyId) {
    return NextResponse.json(
      { error: "Missing company_id" },
      { status: 400, headers: corsHeaders },
    );
  }

  // Strip company_id from body — backend expects it in the URL path only
  const { company_id: _, ...payload } = body;

  const upstream = await fetch(
    `${API_BASE_URL}/api/v1/public/stroll/${companyId}/report`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  if (!upstream.ok) {
    const text = await upstream.text();
    console.error("[stroll proxy] upstream error:", upstream.status, text);
    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  return NextResponse.json({ ok: true }, { status: 202, headers: corsHeaders });
}
