import { NextResponse } from "next/server";
import { MOCK_NEWS } from "@/data/mockData";
import { supabaseAdmin } from "@/lib/supabase";
import fs from "fs";
import path from "path";

const BASE_URL = "https://daereview.daeroom.my.id";

function escapeXml(unsafe: string): string {
  return (unsafe || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

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

export async function GET() {
  const articlesMap = new Map<string, {
    title: string;
    slug: string;
    summary: string;
    date: string;
    author: string;
    category: string;
    image?: string;
  }>();

  // 1. Mock news
  for (const a of MOCK_NEWS) {
    if (a.slug) {
      articlesMap.set(a.slug, {
        title: a.title,
        slug: a.slug,
        summary: a.summary,
        date: new Date().toUTCString(),
        author: a.author || "Tim Redaksi DaeReview",
        category: a.category || "Teknologi",
        image: a.image,
      });
    }
  }

  // 2. Local custom news
  const localArticles = readCustomJsonFile<any>("custom_news.json");
  for (const a of localArticles) {
    if (a.slug && a.status !== "draft") {
      articlesMap.set(a.slug, {
        title: a.title,
        slug: a.slug,
        summary: a.summary || "",
        date: a.date ? new Date(a.date).toUTCString() : new Date().toUTCString(),
        author: a.author || "Tim Redaksi DaeReview",
        category: a.category || "Teknologi",
        image: a.image,
      });
    }
  }

  // 3. Supabase articles
  try {
    if (supabaseAdmin) {
      const { data: supaArticles } = await supabaseAdmin
        .from("articles")
        .select("title, slug, summary, published_at, author, category, image, status")
        .order("published_at", { ascending: false })
        .limit(30);

      if (supaArticles) {
        for (const a of supaArticles) {
          if (a.slug && a.status !== "draft") {
            articlesMap.set(a.slug, {
              title: a.title,
              slug: a.slug,
              summary: a.summary || "",
              date: a.published_at ? new Date(a.published_at).toUTCString() : new Date().toUTCString(),
              author: a.author || "Tim Redaksi DaeReview",
              category: a.category || "Teknologi",
              image: a.image,
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("RSS feed: Supabase fetch error:", err);
  }

  const items = Array.from(articlesMap.values())
    .slice(0, 40)
    .map((item) => {
      const itemUrl = `${BASE_URL}/berita/${item.slug}`;
      return `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${itemUrl}</link>
      <guid isPermaLink="true">${itemUrl}</guid>
      <description>${escapeXml(item.summary)}</description>
      <category>${escapeXml(item.category)}</category>
      <dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">${escapeXml(item.author)}</dc:creator>
      <pubDate>${item.date}</pubDate>
      ${item.image ? `<enclosure url="${escapeXml(item.image)}" type="image/jpeg" />` : ""}
    </item>`;
    })
    .join("");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DaeReview — Panduan Belanja Cerdas &amp; Kabar Tren Terpercaya</title>
    <link>${BASE_URL}</link>
    <description>Portal ulasan independen, perbandingan spesifikasi gadget, audio TWS, dan kabar teknologi harian terpercaya di Indonesia.</description>
    <language>id-ID</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
