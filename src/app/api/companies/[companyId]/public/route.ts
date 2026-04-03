import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ companyId: string }> },
) {
  const { companyId } = await params;

  try {
    const upstream = await fetch(
      `${API_BASE_URL}/api/v1/companies/${companyId}/public`,
      { headers: { "Content-Type": "application/json" } },
    );

    if (!upstream.ok) {
      const text = await upstream.text();
      return new NextResponse(text, {
        status: upstream.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Upstream API unreachable" },
      { status: 502 },
    );
  }
}
