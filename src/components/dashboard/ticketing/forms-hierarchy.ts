import type { Form, Submission } from "@/services/forms";

export interface WebsiteGroup {
  origin: string;
  forms: Form[];
  entryCount: number;
}

export interface PageGroup {
  path: string;
  forms: Form[];
  entryCount: number;
}

export function urlParts(
  link?: string,
): { origin: string; path: string } | null {
  if (!link) return null;
  try {
    const url = new URL(link.includes("://") ? link : `https://${link}`);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    return { origin: url.origin, path };
  } catch {
    return null;
  }
}

export function hostLabel(origin: string): string {
  return origin.replace(/^https?:\/\//, "");
}

export function formatDate(iso?: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "-"
    : d.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
}

export function groupSubmissionsByForm(
  submissions: Submission[],
): Map<string, Submission[]> {
  const map = new Map<string, Submission[]>();
  for (const s of submissions) {
    const list = map.get(s.form_id);
    if (list) list.push(s);
    else map.set(s.form_id, [s]);
  }
  return map;
}

export function deriveWebsites(
  forms: Form[],
  submissionsByForm: Map<string, Submission[]>,
): WebsiteGroup[] {
  const map = new Map<string, WebsiteGroup>();
  for (const form of forms) {
    const parts = urlParts(form.website_link);
    if (!parts) continue;
    const group = map.get(parts.origin) ?? {
      origin: parts.origin,
      forms: [],
      entryCount: 0,
    };
    group.forms.push(form);
    group.entryCount += submissionsByForm.get(form.id)?.length ?? 0;
    map.set(parts.origin, group);
  }
  return [...map.values()].sort((a, b) => b.forms.length - a.forms.length);
}

export function derivePages(
  forms: Form[],
  submissionsByForm: Map<string, Submission[]>,
  origin: string,
): PageGroup[] {
  const map = new Map<string, PageGroup>();
  for (const form of forms) {
    const parts = urlParts(form.website_link);
    if (!parts || parts.origin !== origin) continue;
    const group = map.get(parts.path) ?? {
      path: parts.path,
      forms: [],
      entryCount: 0,
    };
    group.forms.push(form);
    group.entryCount += submissionsByForm.get(form.id)?.length ?? 0;
    map.set(parts.path, group);
  }
  return [...map.values()].sort((a, b) => b.entryCount - a.entryCount);
}

export function derivePageForms(
  forms: Form[],
  origin: string,
  path: string,
): Form[] {
  return forms.filter((form) => {
    const parts = urlParts(form.website_link);
    return parts?.origin === origin && parts.path === path;
  });
}
