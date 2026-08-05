import { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

const BASE_URL = siteConfig.url;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/en/", "/pl/"],
        disallow: [
          "/en/dashboard",
          "/pl/dashboard",
          "/en/login",
          "/pl/login",
          "/en/onboarding",
          "/pl/onboarding",
          "/en/invite",
          "/pl/invite",
          "/en/auth",
          "/pl/auth",
          "/api/",
          // The CMS is not locale-prefixed and has nothing to index.
          "/studio",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
