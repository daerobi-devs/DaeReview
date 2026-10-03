import { NextResponse } from "next/server";
import { MOCK_NEWS, NewsArticle } from "@/data/mockData";
import { supabaseAdmin } from "@/lib/supabase";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "data", "custom_news.json");

function readCustomNewsFromFile(): NewsArticle[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Gagal membaca custom_news.json:", e);
    return [];
  }
}

function writeCustomNewsToFile(data: NewsArticle[]): boolean {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (e) {
    console.error("Gagal menulis custom_news.json:", e);
    return false;
  }
}

function mapSupabaseRowToArticle(row: any): NewsArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    summary: row.summary,
    content: Array.isArray(row.content) ? row.content : [row.summary],
    image: row.image,
    author: row.author || "Tim Riset DaeReview",
    readTime: row.read_time || "4 menit",
    date: row.published_at
      ? new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date(row.published_at))
      : new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date()),
    isTrending: Boolean(row.is_trending),
    isFactCheck: Boolean(row.is_fact_check),
    verdictFactCheck: row.verdict_fact_check || undefined,
    quickTakeaway: row.quick_takeaway || undefined,
    relatedProductId: row.related_product_id || undefined,
    tiktokUrl: row.tiktok_url || undefined,
    isCustom: true,
    status: row.status || "published",
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeDrafts = searchParams.get("include_drafts") === "true";
  const localCustom = readCustomNewsFromFile();
  let supabaseArticles: NewsArticle[] = [];

  try {
    const { data, error } = await supabaseAdmin
      .from("articles")
      .select("*")
      .order("published_at", { ascending: false });

    if (!error && data && data.length > 0) {
      supabaseArticles = data.map(mapSupabaseRowToArticle);
    }
  } catch (err) {
    console.warn("Gagal membaca artikel dari Supabase:", err);
  }

  // Gabungkan artikel: Supabase > Local File Cache > MOCK_NEWS fallback
  const existingSlugs = new Set<string>();
  const combined: NewsArticle[] = [];

  for (const item of supabaseArticles) {
    if (!existingSlugs.has(item.slug)) {
      existingSlugs.add(item.slug);
      combined.push(item);
    }
  }

  for (const item of localCustom) {
    if (!existingSlugs.has(item.slug)) {
      existingSlugs.add(item.slug);
      combined.push(item);
    }
  }

  for (const item of MOCK_NEWS) {
    if (!existingSlugs.has(item.slug)) {
      existingSlugs.add(item.slug);
      combined.push(item);
    }
  }

  const finalArticles = includeDrafts
    ? combined
    : combined.filter((a) => a.status !== "draft");

  return NextResponse.json({
    success: true,
    total: finalArticles.length,
    articles: finalArticles,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: "Judul dan slug artikel wajib diisi." },
        { status: 400 }
      );
    }

    const current = readCustomNewsFromFile();
    const newArticle: NewsArticle = {
      ...body,
      id: body.id || `custom-${Date.now()}`,
      date:
        body.date ||
        new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date()),
      isCustom: true,
    };

    // 1. Simpan ke Supabase Database
    try {
      await supabaseAdmin.from("articles").upsert(
        {
          slug: newArticle.slug,
          title: newArticle.title,
          category: newArticle.category,
          summary: newArticle.summary,
          content: newArticle.content,
          image: newArticle.image,
          author: newArticle.author || "Tim Riset DaeReview",
          read_time: newArticle.readTime || "4 menit",
          is_trending: Boolean(newArticle.isTrending),
          is_fact_check: Boolean(newArticle.isFactCheck),
          verdict_fact_check: newArticle.verdictFactCheck || null,
          quick_takeaway: newArticle.quickTakeaway || null,
          related_product_id: newArticle.relatedProductId || null,
          tiktok_url: newArticle.tiktokUrl || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      );
    } catch (dbErr) {
      console.warn("Gagal simpan artikel ke Supabase:", dbErr);
    }

    // 2. Simpan ke Local File Storage Persisten
    const updated = [newArticle, ...current.filter((a) => a.slug !== newArticle.slug)];
    writeCustomNewsToFile(updated);

    return NextResponse.json({
      success: true,
      message: "Artikel berhasil disimpan di Supabase & Server Cache",
      article: newArticle,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memproses pembuatan artikel." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id && !body.slug) {
      return NextResponse.json(
        { error: "ID atau slug artikel wajib disertakan untuk update." },
        { status: 400 }
      );
    }

    // 1. Update di Supabase Database
    try {
      if (body.slug) {
        await supabaseAdmin
          .from("articles")
          .update({
            title: body.title,
            category: body.category,
            summary: body.summary,
            content: body.content,
            image: body.image,
            author: body.author,
            read_time: body.readTime,
            is_trending: body.isTrending,
            is_fact_check: body.isFactCheck,
            verdict_fact_check: body.verdictFactCheck || null,
            quick_takeaway: body.quickTakeaway || null,
            related_product_id: body.relatedProductId || null,
            tiktok_url: body.tiktokUrl || null,
            status: body.status || undefined,
            updated_at: new Date().toISOString(),
          })
          .eq("slug", body.slug);
      }
    } catch (dbErr) {
      console.warn("Gagal update artikel di Supabase:", dbErr);
    }

    // 2. Update di Local File Storage Persisten
    const current = readCustomNewsFromFile();
    const existingIndex = current.findIndex((a) => a.id === body.id || a.slug === body.slug);
    let updated: NewsArticle[];

    if (existingIndex >= 0) {
      const merged: NewsArticle = {
        ...current[existingIndex],
        ...body,
        isCustom: true,
      };
      current[existingIndex] = merged;
      updated = current;
    } else {
      const mock = MOCK_NEWS.find((m) => m.id === body.id || m.slug === body.slug);
      const newArticle: NewsArticle = {
        ...(mock || {}),
        ...body,
        id: body.id || `custom-${Date.now()}`,
        isCustom: true,
      };
      updated = [newArticle, ...current.filter((a) => a.slug !== newArticle.slug)];
    }

    writeCustomNewsToFile(updated);

    return NextResponse.json({
      success: true,
      message: "Artikel berhasil diperbarui di Supabase & Server Cache",
      article: body,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memperbarui artikel." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    if (!id && !slug) {
      return NextResponse.json(
        { error: "Parameter id atau slug artikel wajib disertakan." },
        { status: 400 }
      );
    }

    // 1. Hapus dari Supabase Database
    try {
      if (slug) {
        await supabaseAdmin.from("articles").delete().eq("slug", slug);
      } else if (id) {
        await supabaseAdmin.from("articles").delete().eq("id", id);
      }
    } catch (dbErr) {
      console.warn("Gagal menghapus artikel dari Supabase:", dbErr);
    }

    // 2. Hapus dari Local File Storage Persisten
    const current = readCustomNewsFromFile();
    const filtered = current.filter((item) => item.id !== id && item.slug !== slug);
    writeCustomNewsToFile(filtered);

    return NextResponse.json({
      success: true,
      message: `Artikel berhasil dihapus dari Supabase & Server Cache.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menghapus artikel." },
      { status: 500 }
    );
  }
}
