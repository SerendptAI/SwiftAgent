/**
 * Origin of the deployed widget server. It serves the bundle and doubles as
 * the widget's API base: its server proxies `/api/*` to the backend, so a
 * staging widget already talks to the staging API. Inlined at build time.
 */
export const WIDGET_ORIGIN = (
  process.env.NEXT_PUBLIC_WIDGET_ORIGIN || "https://widget.swiftagents.org"
).replace(/\/$/, "");

export const WIDGET_SCRIPT_URL = `${WIDGET_ORIGIN}/dist/widget-ui.js`;
