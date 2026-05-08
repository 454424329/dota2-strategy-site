import type { MetadataRoute } from "next";
import { MOCK_HEROES } from "@/lib/mock-data";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dota2-strategy.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 1.0 },
    { url: `${BASE_URL}/heroes`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/items`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/guides`, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 0.8 },
    { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 0.8 },
    { url: `${BASE_URL}/esports`, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 0.7 },
    { url: `${BASE_URL}/meta/tier-list`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.7 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.5 },
  ];

  const heroRoutes = MOCK_HEROES.map((hero) => ({
    url: `${BASE_URL}/heroes/${hero.name}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...heroRoutes];
}
