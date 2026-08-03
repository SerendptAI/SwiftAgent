import { NextRequest, NextResponse } from "next/server";

import {
  isAnalyticsSection,
  proxyAnalytics,
} from "@/lib/admin-analytics-upstream";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> },
) {
  const { section } = await params;

  if (!isAnalyticsSection(section)) {
    return NextResponse.json(
      { error: `Unknown analytics section "${section}".` },
      { status: 404 },
    );
  }

  return proxyAnalytics(section, req.nextUrl.searchParams);
}
