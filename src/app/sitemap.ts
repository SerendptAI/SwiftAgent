import { MetadataRoute } from "next";

const BASE_URL = process.env.APP_URL || "https://swiftagents.org";
const locales = ["en", "pl"];

export default function sitemap(): MetadataRoute.Sitemap {
  const landingPages = locales.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1,
  }));

  return [...landingPages];
}
