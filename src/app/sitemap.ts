import { MetadataRoute } from "next";

import { CASE_STUDIES } from "@/lib/case-studies";
import { siteConfig } from "@/lib/site-config";
import { getPostSummaries } from "@/sanity/posts";

const BASE_URL = siteConfig.url;
const locales = ["en", "pl"] as const;
const defaultLocale = "en";

interface PublicRoute {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}

const publicRoutes: PublicRoute[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/agents", changeFrequency: "weekly", priority: 0.9 },
  { path: "/products", changeFrequency: "weekly", priority: 0.9 },
  { path: "/landing", changeFrequency: "weekly", priority: 0.8 },
  { path: "/demo", changeFrequency: "monthly", priority: 0.8 },
  { path: "/signup", changeFrequency: "monthly", priority: 0.8 },
  { path: "/case-studies", changeFrequency: "monthly", priority: 0.7 },
  ...CASE_STUDIES.map((study) => ({
    path: `/case-studies/${study.id}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  })),
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/affiliate", changeFrequency: "monthly", priority: 0.7 },
  { path: "/refer", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Posts are published from the CMS without a deploy, so they are read at
  // request time rather than baked in with the static routes above.
  const posts = await getPostSummaries();

  const routes: PublicRoute[] = [
    ...publicRoutes,
    ...posts.map((post) => ({
      path: `/blog/${post.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return routes.flatMap((route) => {
    const languages = {
      ...Object.fromEntries(
        locales.map((locale) => [locale, `${BASE_URL}/${locale}${route.path}`]),
      ),
      "x-default": `${BASE_URL}/${defaultLocale}${route.path}`,
    };

    return locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${route.path}`,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages },
    }));
  });
}
