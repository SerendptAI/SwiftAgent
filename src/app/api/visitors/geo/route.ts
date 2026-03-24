import { NextRequest, NextResponse } from "next/server";

import { getCountriesByIps } from "@/services/geo";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

export async function GET(req: NextRequest) {
  const { searchParams } = req.url
    ? new URL(req.url)
    : { searchParams: new URLSearchParams() };

  const companyId = searchParams.get("companyId");
  const limit = searchParams.get("limit") ?? "20";
  const token = req.headers.get("authorization");

  if (!companyId) {
    return NextResponse.json(
      { error: "companyId is required" },
      { status: 400 },
    );
  }

  // Fetch visitors from the backend
  const upstream = await fetch(
    `${API_BASE_URL}/api/v1/dashboard/${companyId}/visitors?limit=${limit}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
    },
  );

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "Failed to fetch visitors" },
      { status: upstream.status },
    );
  }

  const visitors: Array<{
    id: string;
    company_id: string;
    visitor_id: string;
    country_code: string;
    duration_seconds: number;
    timestamp: string;
  }> = await upstream.json();

  // Collect IPs that need geo lookup (visitor_id is the IP)
  const ipsToResolve = visitors
    .filter((v) => !v.country_code && v.visitor_id)
    .map((v) => v.visitor_id);

  const uniqueIps = [...new Set(ipsToResolve)];

  if (uniqueIps.length > 0) {
    const geoMap = await getCountriesByIps(uniqueIps);

    for (const visitor of visitors) {
      if (!visitor.country_code && geoMap.has(visitor.visitor_id)) {
        visitor.country_code = geoMap.get(visitor.visitor_id) ?? "";
      }
    }
  }

  return NextResponse.json(visitors);
}
