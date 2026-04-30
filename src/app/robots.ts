import { MetadataRoute } from "next";

const BASE_URL = process.env.APP_URL || "https://swiftagents.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/en/", "/pl/"],
        disallow: [
          "/en/dashboard/",
          "/pl/dashboard/",
          "/en/login/",
          "/pl/login/",
          "/en/onboarding/",
          "/pl/onboarding/",
          "/en/invite/",
          "/pl/invite/",
          "/en/auth/",
          "/pl/auth/",
          "/api/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
