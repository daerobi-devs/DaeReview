import { NextResponse } from "next/server";
import { NewsArticle } from "@/data/mockData";
import fs from "fs";
import path from "path";

const DIFY_SECRET = process.env.DIFY_WEBHOOK_SECRET || "dae_dify_autonomous_webhook_secret_key";
const DATA_FILE = path.join(process.cwd(), "src", "data", "custom_news.json");

function readCustomNews(): NewsArticle[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function writeCustomNews(data: NewsArticle[]): boolean {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (e) {
    return false;
  }
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/**
 * Endpoint Khusus untuk Dify AI Agent
 * Memungkinkan Dify Workflow menerbitkan artikel berita, tren, cek fakta, atau ulasan produk
 * 
 * Header Wajib:
 * Authorization: Bearer <DIFY_WEBHOOK_SECRET>
 * 
 * Request Body:
 * {
 *   "title": "Judul Artikel",
 *   "category": "Fakta vs Mitos" | "Teknologi & AI" | "Gadget" | "Smart Home" | "Tren Belanja",
 *   "summary": "Ringkasan 1-2 kalimat untuk meta description",
 *   "content": ["Paragraf 1...", "Paragraf 2...", "Paragraf 3..."],
 *   "image": "https://images.unsplash.com/... (atau URL gambar lain)",
 *   "author": "Dify Autonomous Agent (v2.0)",
 *   "isFactCheck": true,
 *   "verdictFactCheck": "MITOS" | "FAKTA" | "SEBAGIAN BENAR",
 *   "quickTakeaway": "Intisari vonis fakta/mitos",
 *   "isTrending": true,
 *   "relatedProductId": "optional-product-id"
 * }
 */
export async function POST(request: Request) {
  try {
    // 1. Verifikasi Autentikasi Dify Agent
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Akses ditolak. Header 'Authorization: Bearer <token>' wajib disertakan." },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "").trim();
    if (token !== DIFY_SECRET) {
      return NextResponse.json(
        { error: "Token Dify tidak valid." },
        { status: 403 }
      );
    }

    // 2. Baca Payload Konten dari Dify
    const body = await request.json();
    const {
      title,
      category = "Teknologi & AI",
      summary,
      content,
      image,
      author = "Dify Autonomous Agent",
      readTime = "4 menit",
      isFactCheck = false,
      verdictFactCheck,
      quickTakeaway,
      isTrending = false,
      relatedProductId,
      tiktokUrl,
    } = body;

    if (!title || !summary) {
      return NextResponse.json(
        { error: "Field 'title' dan 'summary' wajib diisi oleh Dify Agent." },
        { status: 400 }
      );
    }

    // 3. Normalisasi Struktur Artikel
    const cleanSlug = body.slug ? slugify(body.slug) : slugify(title);
    const paragraphs = Array.isArray(content)
      ? content
      : typeof content === "string"
      ? content.split(/\n\s*\n/).filter((p: string) => p.trim().length > 0)
      : [summary];

    const newArticle: NewsArticle = {
      id: `dify-${Date.now()}`,
      title: title.trim(),
      slug: cleanSlug,
      category,
      summary: summary.trim(),
      content: paragraphs,
      image:
        image ||
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      author,
      readTime,
      date: new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
      isFactCheck: isFactCheck || category === "Fakta vs Mitos",
      verdictFactCheck: category === "Fakta vs Mitos" ? verdictFactCheck || "FAKTA" : undefined,
      quickTakeaway: quickTakeaway || summary,
      isTrending,
      relatedProductId,
      tiktokUrl: tiktokUrl || undefined,
      isCustom: true,
    };

    // 4. Simpan ke Database / File
    const current = readCustomNews();
    const updated = [newArticle, ...current.filter((a) => a.slug !== newArticle.slug)];
    writeCustomNews(updated);

    return NextResponse.json({
      success: true,
      message: "Artikel dari Dify AI Agent berhasil diterbitkan secara live!",
      url: `https://daereview.daeroom.my.id/berita/${newArticle.slug}`,
      article: newArticle,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal memproses upload dari Dify Agent.", details: error.message },
      { status: 500 }
    );
  }
}
