import { NextResponse } from "next/server";

import { ANALYTICS_SECTIONS, AnalyticsSection } from "@/lib/admin-analytics";

/**
 * Analytics can be pointed at a different backend from the rest of the app.
 * The endpoints ship on their own schedule, so an environment that has not
 * deployed them yet can borrow one that has without moving auth and every
 * other call along with it. Unset, this is just NEXT_PUBLIC_API_URL.
 */
const API_BASE_URL = (
  process.env.ANALYTICS_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000"
).replace(/\/$/, "");

export const isAnalyticsSection = (value: string): value is AnalyticsSection =>
  ANALYTICS_SECTIONS.includes(value as AnalyticsSection);

const FORWARDED_PARAMS = [
  "days",
  "start_date",
  "end_date",
  "company_id",
  "format",
];

/**
 * The analytics endpoints authenticate server to server, so the key never
 * reaches the browser. The global secret reports across every company, which is
 * what the admin dashboard wants; a company API key still works but scopes
 * every response to that one company.
 */
function authHeaders(): Record<string, string> | null {
  const secret = process.env.ANALYTICS_SECRET_KEY;
  if (secret) {
    return { "X-Secret-Key": secret };
  }

  const apiKey = process.env.X_API_KEY;
  if (apiKey) {
    return { "X-API-Key": apiKey };
  }

  return null;
}

export async function proxyAnalytics(
  section: AnalyticsSection,
  searchParams: URLSearchParams,
  path = "",
) {
  const headers = authHeaders();

  if (!headers) {
    return NextResponse.json(
      {
        error:
          "Analytics is not configured: set ANALYTICS_SECRET_KEY or X_API_KEY.",
      },
      { status: 500 },
    );
  }

  const query = new URLSearchParams();
  for (const key of FORWARDED_PARAMS) {
    const value = searchParams.get(key);
    if (value) {
      query.set(key, value);
    }
  }

  const search = query.toString();
  const url = `${API_BASE_URL}/api/v1/analytics/${section}${path}${
    search ? `?${search}` : ""
  }`;

  let upstream: Response;
  try {
    upstream = await fetch(url, { headers, cache: "no-store" });
  } catch {
    return NextResponse.json(
      { error: "Analytics API unreachable." },
      { status: 502 },
    );
  }

  const contentDisposition = upstream.headers.get("content-disposition");

  return new NextResponse(await upstream.arrayBuffer(), {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/json",
      ...(contentDisposition
        ? { "Content-Disposition": contentDisposition }
        : {}),
    },
  });
}
