import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Ignore Next.js internals, API routes, trpc, AND the /en/embed or /pl/embed routes to stop infinite Next-Intl iframe redirect loops
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*|.*\\/embed.*).*)"],
};
