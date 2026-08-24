import { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

const BASE_URL = siteConfig.url;

/** Locale-prefixed sections that sit behind auth and hold nothing to index. */
const PRIVATE_PATHS = [
  "/dashboard",
  "/login",
  "/onboarding",
  "/invite",
  "/auth",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: routing.locales.map((locale) => `/${locale}/`),
        disallow: [
          ...routing.locales.flatMap((locale) =>
            PRIVATE_PATHS.map((path) => `/${locale}${path}`),
          ),
          "/api/",
          // The CMS is not locale-prefixed and has nothing to index.
          "/studio",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
