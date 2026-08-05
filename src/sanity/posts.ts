import type { PortableTextBlock } from "next-sanity";

import { sanityClient } from "@/sanity/client";

export interface PostImage {
  url: string;
  alt: string;
  lqip?: string;
  aspectRatio?: number;
}

export interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  authorName: string;
  authorRole?: string;
  publishedAt: string;
  coverImage?: PostImage;
}

export interface Post extends PostSummary {
  body: PortableTextBlock[];
}

/**
 * Editors work ahead, so a post is live only once its `publishedAt` has passed.
 * Every query filters on it — there is no other definition of "published".
 */
const PUBLISHED = `_type == "post" && defined(slug.current) && publishedAt <= now()`;

const SUMMARY_FIELDS = `
  "slug": slug.current,
  title,
  excerpt,
  authorName,
  authorRole,
  publishedAt,
  "coverImage": coverImage{
    "url": asset->url,
    alt,
    "lqip": asset->metadata.lqip,
    "aspectRatio": asset->metadata.dimensions.aspectRatio
  }
`;

/**
 * Content is edited outside a deploy, so pages revalidate on a timer rather
 * than being frozen at build. Sixty seconds keeps the CDN useful while making
 * a correction visible without a release.
 */
const REVALIDATE_SECONDS = 60;

/**
 * Empty when Sanity is not configured, and empty when it cannot be reached —
 * a CMS outage degrades the index to its empty state rather than taking a
 * marketing page (and the sitemap) down with it. The failure is logged, not
 * hidden.
 */
export async function getPostSummaries(): Promise<PostSummary[]> {
  if (!sanityClient) return [];

  try {
    return await sanityClient.fetch<PostSummary[]>(
      `*[${PUBLISHED}]|order(publishedAt desc){${SUMMARY_FIELDS}}`,
      {},
      { next: { revalidate: REVALIDATE_SECONDS } },
    );
  } catch (error) {
    console.error("[blog] could not load posts from Sanity:", error);
    return [];
  }
}

/** Inline images are references; without this expansion they render blank. */
const BODY_FIELDS = `
  body[]{
    ...,
    _type == "image" => { ..., "asset": asset->{url} }
  }
`;

/**
 * Null when the slug does not resolve, so callers can 404.
 *
 * Unlike the index, a fetch failure here is deliberately left to throw. "The
 * CMS is unreachable" is not "this post does not exist", and answering 404
 * during an outage invites crawlers to drop a live URL.
 */
export async function getPost(slug: string): Promise<Post | null> {
  if (!sanityClient) return null;

  return sanityClient.fetch<Post | null>(
    `*[${PUBLISHED} && slug.current == $slug][0]{${SUMMARY_FIELDS}, ${BODY_FIELDS}}`,
    { slug },
    { next: { revalidate: REVALIDATE_SECONDS } },
  );
}

const WORDS_PER_MINUTE = 220;

export function getReadingTimeMinutes(body: PortableTextBlock[]): number {
  const words = body
    .filter((block) => block._type === "block")
    .flatMap((block) => {
      const children = (block as { children?: { text?: string }[] }).children;
      return children?.map((child) => child.text ?? "") ?? [];
    })
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function formatPostDate(publishedAt: string, locale: string) {
  return new Date(publishedAt).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
