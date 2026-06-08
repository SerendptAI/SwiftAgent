export function formatDuration(seconds: number): string {
  // 0 / missing → dash: visitor browsed but never chatted (or chatted
  // before duration tracking existed). Reads cleaner than "00:00".
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function formatDate(isoString: string): string {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}
