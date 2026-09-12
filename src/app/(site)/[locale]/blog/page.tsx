/* eslint-disable @next/next/no-img-element -- cover images come from the
   Sanity CDN, which already serves sized transforms. */
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactSection } from "@/components/landing/contact-section";
import { Navbar } from "@/components/landing/navbar";
import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";
import { localeAlternates } from "@/lib/locale-metadata";
import { formatPostDate, getPostSummaries } from "@/sanity/posts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.blog" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates(locale, "/blog"),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("common.blog");
  const posts = await getPostSummaries();

  return (
    <SmoothScrollProvider>
      <main className="font-jetbrains min-h-screen">
        <Navbar />
        <div className="w-full px-6 pt-36 pb-16 md:px-10 md:pt-48 md:pb-20 lg:px-16 lg:pt-56 lg:pb-26">
          <div className="mx-auto max-w-360">
            <p className="mb-4 text-base leading-[1.2] tracking-[2%] text-black/60 uppercase md:text-lg">
              {t("eyebrow")}
            </p>
            <h1 className="font-greed mb-10 text-4xl leading-[1.34] font-medium tracking-[-2%] text-black sm:text-5xl md:mb-14 md:text-[56px] lg:text-[66px]">
              {t("heading")}
            </h1>

            {posts.length === 0 ? (
              <div className="rounded-[10px] border border-black/30 bg-[#F6F4EF]/50 p-10 text-center md:p-16">
                <p className="text-base font-medium tracking-[2%] text-black uppercase md:text-lg">
                  {t("emptyTitle")}
                </p>
                <p className="mx-auto mt-4 max-w-lg text-sm leading-[1.66] tracking-[-2%] text-black/70 md:text-base">
                  {t("emptyBody")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-3">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col gap-5 rounded-[10px] border border-black/30 bg-[#F6F4EF]/50 p-6 transition-all hover:border-black hover:bg-[#F6F4EF] hover:shadow-[-4px_4px_0px_0px_#000000] md:p-8"
                  >
                    {post.coverImage?.url && (
                      <span className="block aspect-video w-full overflow-hidden rounded-[6px] border border-black/20">
                        <img
                          src={post.coverImage.url}
                          alt={post.coverImage.alt}
                          className="h-full w-full object-cover"
                        />
                      </span>
                    )}
                    <time
                      dateTime={post.publishedAt}
                      className="text-xs tracking-[10%] text-black/60 uppercase md:text-sm"
                    >
                      {formatPostDate(post.publishedAt, locale)}
                    </time>
                    <h2 className="font-greed text-xl leading-[1.2] font-medium tracking-[-1%] text-black uppercase md:text-2xl">
                      {post.title}
                    </h2>
                    <p className="line-clamp-3 text-sm leading-[1.66] tracking-[2%] text-black/80 md:text-base">
                      {post.excerpt}
                    </p>
                    <span className="mt-auto text-sm font-medium tracking-[10%] text-black uppercase transition-transform group-hover:translate-x-1 md:text-base">
                      {t("readPost")}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        <ContactSection />
      </main>
    </SmoothScrollProvider>
  );
}
