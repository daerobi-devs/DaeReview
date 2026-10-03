import type { MetadataRoute } from "next";
import { BUYING_GUIDES, MOCK_NEWS } from "@/data/mockData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://daereview.daeroom.my.id";
  const currentDate = new Date().toISOString();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/berita`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pedoman-editorial`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/kebijakan-privasi`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/syarat-ketentuan`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Buying Guide routes (Highest organic conversion intent)
  const guideRoutes: MetadataRoute.Sitemap = BUYING_GUIDES.map((guide) => ({
    url: `${baseUrl}/panduan/${guide.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.95,
  }));

  // News & Trend routes (Freshness & daily traffic)
  const newsRoutes: MetadataRoute.Sitemap = MOCK_NEWS.map((article) => ({
    url: `${baseUrl}/berita/${article.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...guideRoutes, ...newsRoutes];
}
