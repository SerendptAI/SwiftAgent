import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";
import { stripLocalePrefix } from "./lib/locale-path";

const intlMiddleware = createMiddleware(routing);

/** Routes that need CORS for cross-origin widget embedding. */
const WIDGET_CORS_PATTERN =
  /^\/api\/(companies|visitors|chat|tts|stt|stroll)|^\/(widget-ui\.js|stroll\.js)/;

/**
 * The admin host serves the analytics dashboard and nothing else. It runs the
 * same image as the landing host, so the split is by hostname rather than by
 * build.
 */
const ADMIN_HOST = process.env.ADMIN_HOST || "ns.swiftagents.org";

const ADMIN_ANALYTICS_PATH = "/admin/analytics";
const ADMIN_ANALYTICS_API_PATH = `/api${ADMIN_ANALYTICS_PATH}`;

/**
 * Locales that were published and may still be indexed. Once one leaves
 * `routing`, intl routing reads its stale prefix as a path segment and sends
 * /pl/agents to /en/pl/agents, so the rewrite to the default locale has to
 * happen before that runs. `next.config.ts` redirects are too late: middleware
 * is ahead of them in the request pipeline.
 */
const RETIRED_LOCALE_PATTERN = /^\/pl(?=\/|$)/;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function isAdminHost(req: NextRequest) {
  // A reverse proxy that rewrites Host to the upstream address would leave the
  // gate permanently inert, so the forwarded name wins when it is present.
  const host =
    req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
  const hostname = host.split(",")[0].trim().split(":")[0];

  return hostname.toLowerCase() === ADMIN_HOST.toLowerCase();
}

function isWithin(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(`${base}/`);
}

/** The analytics page itself, plus the API routes it reads its data from. */
function isAdminAnalyticsPath(pathname: string) {
  if (isWithin(pathname, ADMIN_ANALYTICS_API_PATH)) return true;

  return isWithin(stripLocalePrefix(pathname), ADMIN_ANALYTICS_PATH);
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isAdminHost(req)) {
    // The bare domain is the only convenience redirect; everything else that
    // is not the analytics dashboard does not exist on this host.
    if (pathname === "/") {
      return NextResponse.redirect(
        new URL(
          `/${routing.defaultLocale}${ADMIN_ANALYTICS_PATH}`,
          req.nextUrl,
        ),
      );
    }

    if (!isAdminAnalyticsPath(pathname)) {
      return new NextResponse(null, { status: 404 });
    }
  }

  // Handle CORS for widget assets and API routes
  if (WIDGET_CORS_PATTERN.test(pathname)) {
    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    const res = NextResponse.next();
    for (const [key, value] of Object.entries(corsHeaders)) {
      res.headers.set(key, value);
    }
    return res;
  }

  // Route handlers are never locale-prefixed. Without this, intl routing
  // redirects /api/... to /en/api/... and the handler never runs.
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Skip intl middleware for auth callback to preserve query params (tokens)
  if (pathname.includes("/auth/callback")) {
    return NextResponse.next();
  }

  if (RETIRED_LOCALE_PATTERN.test(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(
      RETIRED_LOCALE_PATTERN,
      `/${routing.defaultLocale}`,
    );
    return NextResponse.redirect(url, 308);
  }

  // Everything else — intl routing
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    // Widget static assets (for CORS)
    "/widget-ui.js",
    "/stroll.js",
    // API routes (for CORS)
    "/api/:path*",
    // All other routes except Next.js internals, static files, and embed.
    // `ingest` is the PostHog proxy from next.config.ts and `studio` is the
    // Sanity Studio, which lives outside [locale]: locale routing would
    // rewrite both, and the admin-host gate would 404 them.
    "/((?!trpc|ingest|studio|_next|_vercel|.*\\..*|.*\\/embed.*).*)",
  ],
};
