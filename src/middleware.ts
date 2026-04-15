import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/** Routes that need CORS for cross-origin widget embedding. */
const WIDGET_CORS_PATTERN =
  /^\/api\/(companies|visitors|chat|tts|stt|stroll)|^\/(widget-ui\.js|stroll\.js)/;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
