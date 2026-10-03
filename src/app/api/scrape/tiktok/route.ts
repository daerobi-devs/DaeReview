import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "URL TikTok wajib disertakan." },
        { status: 400 }
      );
    }

    const trimmedUrl = url.trim();

    // 1. Validasi Keamanan: Pastikan hanya domain resmi TikTok (Anti-SSRF)
    const allowedDomains = [
      "tiktok.com",
      "www.tiktok.com",
      "vt.tiktok.com",
      "m.tiktok.com",
      "shop.tiktok.com",
      "seller-id.tiktok.com"
    ];

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(trimmedUrl);
    } catch {
      return NextResponse.json(
        { success: false, error: "Format URL tidak valid. Masukkan URL TikTok yang benar." },
        { status: 400 }
      );
    }

    const isAllowed = allowedDomains.some(
      (domain) => parsedUrl.hostname === domain || parsedUrl.hostname.endsWith("." + domain)
    );

    if (!isAllowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Domain tidak diizinkan. Harap masukkan tautan resmi TikTok / TikTok Shop.",
        },
        { status: 403 }
      );
    }

    // 2. Coba Metode 1: TikTok Official oEmbed API
    try {
      const oembedRes = await fetch(
        `https://www.tiktok.com/oembed?url=${encodeURIComponent(trimmedUrl)}`,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          },
          next: { revalidate: 3600 },
        }
      );

      if (oembedRes.ok) {
        const oembedData = await oembedRes.json();
        return NextResponse.json({
          success: true,
          type: "video_oembed",
          title: oembedData.title || "Review Produk TikTok",
          image: oembedData.thumbnail_url || "",
          author: oembedData.author_name || "Kreator TikTok",
          html: oembedData.html || "",
          source: "TikTok oEmbed API",
          originalUrl: trimmedUrl,
        });
      }
    } catch (oembedErr) {
      console.warn("oEmbed gagal, mencoba scraping OpenGraph...", oembedErr);
    }

    // 3. Coba Metode 2: Server-Side Open Graph Scraper untuk TikTok Shop
    try {
      const pageRes = await fetch(trimmedUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8",
        },
        redirect: "follow",
      });

      if (pageRes.ok) {
        const html = await pageRes.text();

        // Regex parsing OpenGraph Tags
        const ogTitleMatch =
          html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
          html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i) ||
          html.match(/<title>([^<]+)<\/title>/i);

        const ogImageMatch =
          html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
          html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);

        const ogDescMatch =
          html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i) ||
          html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);

        let title = ogTitleMatch ? ogTitleMatch[1] : "";
        let image = ogImageMatch ? ogImageMatch[1] : "";
        let description = ogDescMatch ? ogDescMatch[1] : "";

        // Bersihkan title dari embel-embel TikTok
        title = title.replace(/\s*\|\s*TikTok$/i, "").replace(/\s*-\s*TikTok$/i, "").trim();

        if (title || image) {
          return NextResponse.json({
            success: true,
            type: "product_opengraph",
            title: title || "Produk Rekomendasi TikTok Shop",
            image: image,
            summary: description,
            author: "TikTok Shop Official",
            source: "OpenGraph Metadata",
            originalUrl: trimmedUrl,
          });
        }
      }
    } catch (scrapeErr) {
      console.warn("Scraping OG gagal:", scrapeErr);
    }

    // 4. Fallback jika TikTok membatasi / CAPTCHA
    return NextResponse.json({
      success: true,
      type: "fallback",
      title: "Rekomendasi Produk Pilihan TikTok Shop",
      image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=1200&q=80",
      author: "TikTok Affiliate",
      message: "Tautan TikTok berhasil ditautkan. Anda dapat menyesuaikan foto & judul barang secara manual jika diperlukan.",
      originalUrl: trimmedUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Gagal memproses data TikTok.", details: error.message },
      { status: 500 }
    );
  }
}
