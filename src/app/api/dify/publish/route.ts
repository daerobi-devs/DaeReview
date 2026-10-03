import { NextResponse } from "next/server";
import { NewsArticle } from "@/data/mockData";
import { supabaseAdmin } from "@/lib/supabase";
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

const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  smartphone: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80",
  laptop: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
  audio: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80",
  accessories: "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=1200&q=80",
  gadget: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80",
  "myth-busting": "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=80",
  "fakta vs mitos": "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=80",
  "teknologi & ai": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
  default: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
};

async function fetchOgImage(urlStr: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(urlStr, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;

    const reader = res.body?.getReader();
    if (!reader) return null;
    let html = "";
    let bytesRead = 0;
    while (bytesRead < 70000) {
      const { done, value } = await reader.read();
      if (done || !value) break;
      html += new TextDecoder("utf-8").decode(value);
      bytesRead += value.length;
      if (html.includes("</head>")) break;
    }
    controller.abort();

    const ogMatch =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);

    if (ogMatch && ogMatch[1]) {
      let imgUrl = ogMatch[1].trim();
      if (imgUrl.startsWith("//")) imgUrl = "https:" + imgUrl;
      if (imgUrl.startsWith("http")) return imgUrl;
    }
    return null;
  } catch {
    return null;
  }
}

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8810761979:AAFTbAVxgfarUaqN7JBPmVc9liWFKjPMR4o";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "7045828398";

function cleanTgText(text: string): string {
  if (!text) return "";
  return text.replace(/\[/g, "(").replace(/\]/g, ")");
}

async function notifyTelegram(
  article: NewsArticle,
  theCatch?: string,
  productLink?: string,
  divisionName: string = "Tim 1: DaeReview Newsroom"
) {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

    const isDraft = article.status === "draft";
    const statusLabel = isDraft
      ? "🟡 DRAFT (Menunggu Persetujuan CEO)"
      : "🟢 SUDAH TAYANG LIVE";

    const titleClean = cleanTgText(article.title);
    const summaryClean = cleanTgText(article.summary);
    const theCatchClean = cleanTgText(theCatch || "");
    const divClean = cleanTgText(divisionName);

    const lines = [
      isDraft ? `🟡 *(DRAF SIAP DIREVIU - DAE REVIEW)*` : `📢 *(ARTIKEL RESMI TERBIT)*`,
      ``,
      `🏢 *Divisi Penggarap:* ${divClean}`,
      `📌 *Judul:*`,
      `${titleClean}`,
      ``,
      `🏷️ *Kategori:* ${article.category} • ⏱️ ${article.readTime}`,
      `📊 *Status:* ${statusLabel}`,
      theCatchClean ? `⚠️ *The Catch:* _${theCatchClean}_` : "",
      productLink ? `🔗 *Sumber Link:* ${productLink}` : "",
      ``,
      `💡 *Ringkasan:*`,
      `${summaryClean}`,
    ].filter(Boolean);

    const message = lines.join("\n");
    const replyMarkup = isDraft
      ? {
          inline_keyboard: [
            [
              {
                text: "✅ SETUJUI & TAYANGKAN",
                callback_data: `approve_news:${article.slug}`,
              },
              {
                text: "❌ Tolak / Buang",
                callback_data: `reject_news:${article.slug}`,
              },
            ],
            [
              {
                text: "👁️ Pratinjau Draf",
                url: `https://daereview.daeroom.my.id/berita/${article.slug}`,
              },
              {
                text: "✏️ Kelola di Admin",
                url: "https://daereview.daeroom.my.id/admin/berita",
              },
            ],
          ],
        }
      : {
          inline_keyboard: [
            [
              {
                text: "🌐 Baca di Portal",
                url: `https://daereview.daeroom.my.id/berita/${article.slug}`,
              },
              {
                text: "✏️ Kelola di Admin",
                url: "https://daereview.daeroom.my.id/admin/berita",
              },
            ],
          ],
        };

    // 1. Coba kirimkan bersama foto jika ada URL gambar valid
    if (article.image && article.image.startsWith("http")) {
      try {
        const photoRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            photo: article.image,
            caption: message.slice(0, 1024),
            parse_mode: "Markdown",
            reply_markup: replyMarkup,
          }),
        });
        if (photoRes.ok) return;

        // Fallback foto tanpa Markdown jika gagal parse
        const photoPlain = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            photo: article.image,
            caption: message.slice(0, 1024),
            reply_markup: replyMarkup,
          }),
        });
        if (photoPlain.ok) return;
      } catch {
        // fallback ke pesan teks
      }
    }

    // 2. Fallback pesan teks biasa
    try {
      const textRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
          reply_markup: replyMarkup,
        }),
      });

      if (!textRes.ok) {
        // Fallback teks tanpa parse_mode
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            reply_markup: replyMarkup,
          }),
        });
      }
    } catch (msgErr) {
      console.error("Gagal kirim Telegram sendMessage:", msgErr);
    }
  } catch (e) {
    console.error("Gagal mengirim notifikasi Telegram:", e);
  }
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

    const effectiveSummary = (summary || body.excerpt || quickTakeaway || "").trim();
    if (!title || !effectiveSummary) {
      return NextResponse.json(
        { error: "Field 'title' dan 'summary'/'excerpt' wajib diisi oleh Dify Agent." },
        { status: 400 }
      );
    }

    // 3. Normalisasi Struktur Artikel
    const cleanSlug = body.slug ? slugify(body.slug) : slugify(title);
    
    let rawText = "";
    if (Array.isArray(content)) {
      rawText = content.join("\n\n");
    } else if (typeof content === "string") {
      rawText = content;
    } else {
      rawText = effectiveSummary;
    }

    // Normalisasi spasi sebelum dan sesudah heading serta list item
    const normalizedText = rawText
      .replace(/([^\n])\n(#{1,4}\s+[^\n]+)/g, "$1\n\n$2")
      .replace(/(#{1,4}\s+[^\n]+)\n([^\n#])/g, "$1\n\n$2")
      .replace(/([^\n])\n([-*]\s+[^\n]+)/g, "$1\n\n$2");

    const paragraphs = normalizedText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    // Ekstraksi Gambar Asli (OG Image / Sumber Link / Kategori)
    let finalImage = (image || "").trim();
    const targetLink = (
      body.product_link ||
      body.productLink ||
      body.source_url ||
      body.sourceUrl ||
      body.link ||
      body.url ||
      ""
    ).trim();

    // Jika belum ada gambar spesifik atau masih gambar sirkuit generik, coba scrape dari link sumber
    if ((!finalImage || finalImage.includes("photo-1518770660439-4636190af475")) && targetLink && targetLink.startsWith("http")) {
      const scrapedImg = await fetchOgImage(targetLink);
      if (scrapedImg) {
        finalImage = scrapedImg;
      }
    }

    // Jika tetap belum ada, gunakan gambar kurasi sesuai kategori
    if (!finalImage || finalImage.includes("photo-1518770660439-4636190af475")) {
      const catKey = category.toLowerCase().trim();
      finalImage = CATEGORY_DEFAULT_IMAGES[catKey] || CATEGORY_DEFAULT_IMAGES.default;
    }

    const divisionName =
      body.division ||
      (body.type === "product_review" || body.type === "product"
        ? "Tim 2: DaeReview Product Lab"
        : "Tim 1: DaeReview Newsroom");

    const newArticle: NewsArticle = {
      id: `dify-${Date.now()}`,
      title: title.trim(),
      slug: cleanSlug,
      category,
      summary: effectiveSummary,
      content: paragraphs,
      image: finalImage,
      author,
      readTime,
      date: new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
      isFactCheck: isFactCheck || category === "Fakta vs Mitos",
      verdictFactCheck: category === "Fakta vs Mitos" ? verdictFactCheck || "FAKTA" : undefined,
      quickTakeaway: quickTakeaway || effectiveSummary,
      isTrending,
      relatedProductId,
      tiktokUrl: tiktokUrl || undefined,
      isCustom: true,
      status: body.status === "published" ? "published" : "draft",
    };

    // 4. Simpan ke Supabase Database (public.articles)
    try {
      const { error: dbError } = await supabaseAdmin.from("articles").upsert(
        {
          slug: newArticle.slug,
          title: newArticle.title,
          category: newArticle.category,
          summary: newArticle.summary,
          content: newArticle.content,
          image: newArticle.image,
          author: newArticle.author,
          read_time: newArticle.readTime,
          is_trending: newArticle.isTrending,
          is_fact_check: newArticle.isFactCheck,
          verdict_fact_check: newArticle.verdictFactCheck || null,
          quick_takeaway: newArticle.quickTakeaway || null,
          related_product_id: newArticle.relatedProductId || null,
          tiktok_url: newArticle.tiktokUrl || null,
          status: newArticle.status,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      );
      if (dbError) {
        console.warn("Catatan simpan Supabase (articles):", dbError.message);
      }
    } catch (dbErr) {
      console.warn("Gagal simpan ke Supabase:", dbErr);
    }

    // 5. Simpan ke File Storage Persisten Server (Cache Cepat)
    const current = readCustomNews();
    const updated = [newArticle, ...current.filter((a) => a.slug !== newArticle.slug)];
    writeCustomNews(updated);

    // 6. Notifikasi Human-in-the-Loop ke Bot Telegram Pribadi Owner
    await notifyTelegram(
      newArticle,
      body.the_catch || body.theCatch,
      body.product_link || body.productLink,
      divisionName
    );

    return NextResponse.json({
      success: true,
      message:
        newArticle.status === "draft"
          ? "Draf artikel berhasil disimpan! Notifikasi verifikasi telah dikirim ke Telegram CEO."
          : "Artikel berhasil diterbitkan secara live!",
      url: `https://daereview.daeroom.my.id/berita/${newArticle.slug}`,
      status: newArticle.status,
      article: newArticle,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal memproses upload dari Dify Agent.", details: error.message },
      { status: 500 }
    );
  }
}
