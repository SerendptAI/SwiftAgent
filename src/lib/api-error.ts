import axios from "axios";

/**
 * The message an API failure should put on screen: the backend's own `detail`
 * when it sent one, and the caller's fallback otherwise.
 *
 * An AxiosError is also an Error, so falling through to `error.message` would
 * surface "Request failed with status code 500" — the raw string the fallback
 * exists to replace. Only a non-HTTP failure gets to speak for itself.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string" && detail.trim()) return detail;
    if (Array.isArray(detail) && detail.length > 0) {
      const first = detail[0];
      if (typeof first === "string") return first;
      if (first && typeof first.msg === "string") return first.msg;
    }
    return fallback;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
