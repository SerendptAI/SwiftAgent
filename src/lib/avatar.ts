import { API_BASE_URL } from "@/lib/api-client";

const DEFAULT_AVATAR = "/images/chats/newimg.svg";

/**
 * Resolve a chat / ticket avatar to a renderable URL.
 *
 * The backend now assigns avatars and returns either an absolute URL or a
 * relative path that must be served by the API origin. Falls back to a local
 * SVG when the field is missing.
 */
export function resolveAvatarUrl(path: string | null | undefined): string {
  if (!path) return DEFAULT_AVATAR;
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}
