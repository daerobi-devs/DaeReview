import type { MetadataRoute } from "next";
import { BUYING_GUIDES, MOCK_NEWS } from "@/data/mockData";
import { supabaseAdmin } from "@/lib/supabase";
import fs from "fs";
import path from "path";

const BASE_URL = "https://daereview.daeroom.my.id";

function readCustomJsonFile<T>(filename: string): T[] {
  try {
    const filePath = path.join(process.cwd(), "src", "data", filename);
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // 1. Rute Statis & Legalitas Wajib Google
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/berita`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/tentang`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/kontak`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pedoman-editorial`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/kebijakan-privasi`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/syarat-ketentuan`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // 2. Ambil Seluruh Panduan Belanja (Mock + Local JSON + Supabase)
  const guideSlugs = new Map<string, { slug: string; updatedAt?: string }>();

  // A. Mock guides
  for (const g of BUYING_GUIDES) {
    if (g.slug) guideSlugs.set(g.slug, { slug: g.slug });
  }

  // B. Local custom guides
  const localGuides = readCustomJsonFile<{ slug: string; updatedAt?: string }>("custom_guides.json");
  for (const g of localGuides) {
    if (g.slug) guideSlugs.set(g.slug, { slug: g.slug, updatedAt: g.updatedAt });
  }

  // C. Supabase guides
  try {
    if (supabaseAdmin) {
      const { data: supaGuides } = await supabaseAdmin
        .from("guides")
        .select("slug, updated_at");
      if (supaGuides) {
        for (const g of supaGuides) {
          if (g.slug) guideSlugs.set(g.slug, { slug: g.slug, updatedAt: g.updated_at });
        }
      }
    }
  } catch (err) {
    console.error("Sitemap: Supabase guides error (fallback ke cache):", err);
  }

  const guideRoutes: MetadataRoute.Sitemap = Array.from(guideSlugs.values()).map((guide) => ({
    url: `${BASE_URL}/panduan/${guide.slug}`,
    lastModified: guide.updatedAt || currentDate,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // 3. Ambil Seluruh Artikel Berita & Tren (Mock + Local JSON + Supabase)
  const articleSlugs = new Map<string, { slug: string; date?: string; status?: string }>();

  // A. Mock news
  for (const a of MOCK_NEWS) {
    if (a.slug) articleSlugs.set(a.slug, { slug: a.slug });
  }

  // B. Local custom news
  const localArticles = readCustomJsonFile<{ slug: string; status?: string; date?: string }>("custom_news.json");
  for (const a of localArticles) {
    if (a.slug && a.status !== "draft") {
      articleSlugs.set(a.slug, { slug: a.slug, date: a.date });
    }
  }

  // C. Supabase articles
  try {
    if (supabaseAdmin) {
      const { data: supaArticles } = await supabaseAdmin
        .from("articles")
        .select("slug, published_at, status");
      if (supaArticles) {
        for (const a of supaArticles) {
          if (a.slug && a.status !== "draft") {
            articleSlugs.set(a.slug, { slug: a.slug, date: a.published_at });
          }
        }
      }
    }
  } catch (err) {
    console.error("Sitemap: Supabase articles error (fallback ke cache):", err);
  }

  const newsRoutes: MetadataRoute.Sitemap = Array.from(articleSlugs.values()).map((art) => ({
    url: `${BASE_URL}/berita/${art.slug}`,
    lastModified: art.date || currentDate,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  return [...staticRoutes, ...guideRoutes, ...newsRoutes];
}
