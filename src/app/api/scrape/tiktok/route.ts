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

    // 1. Validasi Keamanan: Pastikan hanya domain resmi TikTok, Tokopedia, dan Shopee (Anti-SSRF)
    const allowedDomains = [
      "tiktok.com",
      "www.tiktok.com",
      "vt.tiktok.com",
      "m.tiktok.com",
      "shop.tiktok.com",
      "seller-id.tiktok.com",
      "tokopedia.com",
      "www.tokopedia.com",
      "vt.tokopedia.com",
      "shop-id.tokopedia.com",
      "shop.tokopedia.com",
      "shopee.co.id",
      "s.shopee.co.id",
      "www.shopee.co.id"
    ];

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(trimmedUrl);
    } catch {
      return NextResponse.json(
        { success: false, error: "Format URL tidak valid. Masukkan URL toko atau TikTok yang benar." },
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
          error: "Domain tidak diizinkan. Harap masukkan tautan resmi TikTok Shop, Tokopedia, atau Shopee.",
        },
        { status: 403 }
      );
    }

    // 2. Deteksi Cepat Khusus Tautan TikTok Shop Tokopedia (vt.tokopedia.com & shop-id.tokopedia.com)
    if (parsedUrl.hostname.includes("tokopedia.com") || parsedUrl.hostname.includes("shop.tiktok.com")) {
      try {
        const headRes = await fetch(trimmedUrl, {
          method: "GET",
          redirect: "manual",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
          },
        });

        const location = headRes.headers.get("location");
        if (location) {
          const locUrl = new URL(location);
          const ogInfoParam = locUrl.searchParams.get("og_info");
          if (ogInfoParam) {
            try {
              const ogData = JSON.parse(decodeURIComponent(ogInfoParam));
              if (ogData.title) {
                const img = ogData.image ? ogData.image.replace(/\\/g, "") : "";
                return NextResponse.json({
                  success: true,
                  type: "tokopedia_product",
                  title: ogData.title,
                  image: img,
                  author: "TikTok Shop x Tokopedia",
                  store: "tokopedia",
                  html: "",
                  source: "TikTok Shop Tokopedia Affiliate",
                  originalUrl: trimmedUrl,
                  data: {
                    title: ogData.title,
                    image: img,
                    store: "tokopedia",
                    originalUrl: trimmedUrl,
                  },
                });
              }
            } catch {
              // fallback
            }
          }
        }
      } catch (tokopediaErr) {
        console.warn("Tokopedia redirect scraper warning:", tokopediaErr);
      }
    }

    // 3. Deteksi Khusus Tautan Toko Shopee (shopee.co.id & s.shopee.co.id)
    if (parsedUrl.hostname.includes("shopee.co.id")) {
      try {
        const shopeeRes = await fetch(trimmedUrl, {
          method: "GET",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
          },
          redirect: "follow",
        });

        if (shopeeRes.ok) {
          const html = await shopeeRes.text();
          const ogTitleMatch =
            html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
            html.match(/<title>([^<]+)<\/title>/i);
          const ogImageMatch =
            html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);

          const title = ogTitleMatch ? ogTitleMatch[1].replace(/\s*\|\s*Shopee Indonesia$/i, "").trim() : "";
          const image = ogImageMatch ? ogImageMatch[1] : "";

          if (title || image) {
            return NextResponse.json({
              success: true,
              type: "shopee_product",
              title: title || "Produk Rekomendasi Shopee",
              image: image,
              author: "Shopee Official",
              store: "shopee",
              html: "",
              source: "Shopee Indonesia",
              originalUrl: trimmedUrl,
              data: {
                title: title || "Produk Rekomendasi Shopee",
                image: image,
                store: "shopee",
                originalUrl: trimmedUrl,
              },
            });
          }
        }
      } catch (shopeeErr) {
        console.warn("Shopee scraper warning:", shopeeErr);
      }
    }

    // 3. Coba Metode 1: TikTok Official oEmbed API
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
          store: "tiktok",
          html: oembedData.html || "",
          source: "TikTok oEmbed API",
          originalUrl: trimmedUrl,
          data: {
            title: oembedData.title || "Review Produk TikTok",
            image: oembedData.thumbnail_url || "",
            store: "tiktok",
            originalUrl: trimmedUrl,
          },
        });
      }
    } catch (oembedErr) {
      console.warn("oEmbed gagal, mencoba scraping OpenGraph...", oembedErr);
    }

    // 4. Coba Metode 3: Server-Side Open Graph Scraper untuk TikTok Shop
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
            store: "tiktok",
            source: "OpenGraph Metadata",
            originalUrl: trimmedUrl,
            data: {
              title: title || "Produk Rekomendasi TikTok Shop",
              image: image,
              store: "tiktok",
              originalUrl: trimmedUrl,
            },
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
