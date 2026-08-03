import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

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

/** The page itself, plus the API routes it reads its data from. */
const ADMIN_ALLOWED_PATTERN = new RegExp(
  `^(?:/(?:${routing.locales.join("|")}))?${ADMIN_ANALYTICS_PATH}(?:/|$)|^/api/admin/analytics(?:/|$)`,
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function isAdminHost(req: NextRequest) {
  const host = req.headers.get("host");
  if (!host) return false;

  // Strip the port so a host:3000 style header still matches.
  return host.split(":")[0].toLowerCase() === ADMIN_HOST.toLowerCase();
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

    if (!ADMIN_ALLOWED_PATTERN.test(pathname)) {
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
    // All other routes except Next.js internals, static files, and embed
    "/((?!trpc|_next|_vercel|.*\\..*|.*\\/embed.*).*)",
  ],
};
