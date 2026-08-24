/* eslint-disable @next/next/no-img-element -- cover images come from the
   Sanity CDN, which already serves sized transforms. */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { ContactSection } from "@/components/landing/contact-section";
import { Navbar } from "@/components/landing/navbar";
import { PostBody } from "@/components/landing/post-body";
import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";
import { routing } from "@/i18n/routing";
import { localeAlternates } from "@/lib/locale-metadata";
import { siteConfig } from "@/lib/site-config";
import {
  formatPostDate,
  getPost,
  getPostSummaries,
  getReadingTimeMinutes,
} from "@/sanity/posts";

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPostSummaries();

  return routing.locales.flatMap((locale) =>
    posts.map((post) => ({ locale, slug: post.slug })),
  );
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const path = `/blog/${post.slug}`;
  const url = `${siteConfig.url}/${locale}${path}`;

  return {
    title: `${post.title} — Swift Agents`,
    description: post.excerpt,
    alternates: localeAlternates(locale, path),
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      authors: [post.authorName],
      images: post.coverImage?.url ? [post.coverImage.url] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage?.url ? [post.coverImage.url] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPost(slug);
  if (!post) notFound();

  const readingTime = getReadingTimeMinutes(post.body);

  return (
    <SmoothScrollProvider>
      <main className="min-h-screen bg-white">
        <Navbar />
        <article className="w-full px-6 pt-36 pb-16 md:px-10 md:pt-48 md:pb-20 lg:px-16 lg:pt-56 lg:pb-26">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="font-dm-mono mb-10 flex w-fit items-center gap-2 text-sm tracking-[10%] text-black/60 uppercase transition-colors hover:text-black md:mb-14 md:text-base"
            >
              ← All posts
            </Link>

            <h1 className="font-greed-narrow mb-6 text-3xl leading-[1.15] font-medium tracking-[-2%] text-black uppercase sm:text-4xl md:text-5xl">
              {post.title}
            </h1>

            <div className="font-dm-mono mb-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs tracking-[10%] text-black/60 uppercase md:mb-14 md:text-sm">
              <span className="text-black">{post.authorName}</span>
              {post.authorRole && <span>· {post.authorRole}</span>}
              <span>·</span>
              <time dateTime={post.publishedAt}>
                {formatPostDate(post.publishedAt, locale)}
              </time>
              <span>· {readingTime} min read</span>
            </div>

            {post.coverImage?.url && (
              <img
                src={post.coverImage.url}
                alt={post.coverImage.alt}
                className="mb-12 w-full rounded-[10px] border border-black/20 md:mb-16"
              />
            )}

            <PostBody body={post.body} />
          </div>
        </article>
        <ContactSection />
      </main>
    </SmoothScrollProvider>
  );
}
