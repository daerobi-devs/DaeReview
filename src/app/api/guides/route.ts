import { NextResponse } from "next/server";
import { BUYING_GUIDES, BuyingGuide } from "@/data/mockData";
import { supabaseAdmin } from "@/lib/supabase";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "data", "custom_guides.json");

function readCustomGuidesFromFile(): BuyingGuide[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Gagal membaca custom_guides.json:", e);
    return [];
  }
}

function writeCustomGuidesToFile(data: BuyingGuide[]): boolean {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (e) {
    console.error("Gagal menulis custom_guides.json:", e);
    return false;
  }
}

function mapSupabaseRowToGuide(row: any): BuyingGuide {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle || "",
    category: row.category || "gadget",
    categoryName: row.category_name || "Gadget & Setup",
    updatedAt: row.updated_at
      ? new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date(row.updated_at))
      : "Terbaru",
    readTime: row.read_time || "6 menit",
    author: row.author || {
      name: "Tim Redaksi DaeReview",
      role: "Lead Hardware & Gadget Editor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    },
    coverImage:
      row.cover_image ||
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    excerpt: row.excerpt || row.subtitle || "",
    isFeatured: Boolean(row.is_featured),
    itemCount: Number(row.item_count) || (Array.isArray(row.products) ? row.products.length : 0),
    intro: Array.isArray(row.intro) ? row.intro : [row.subtitle || ""],
    quickPicks: Array.isArray(row.quick_picks) ? row.quick_picks : [],
    products: Array.isArray(row.products) ? row.products : [],
    buyingAdvice: Array.isArray(row.buying_advice) ? row.buying_advice : [],
    faqs: Array.isArray(row.faqs) ? row.faqs : [],
  };
}

export async function GET() {
  const localCustom = readCustomGuidesFromFile();
  let supabaseGuides: BuyingGuide[] = [];

  try {
    const { data, error } = await supabaseAdmin
      .from("guides")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      supabaseGuides = data.map(mapSupabaseRowToGuide);
    }
  } catch (err) {
    // Supabase table may not exist yet; gracefully fallback
  }

  const existingSlugs = new Set<string>();
  const combined: BuyingGuide[] = [];

  for (const item of supabaseGuides) {
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

  for (const item of BUYING_GUIDES) {
    if (!existingSlugs.has(item.slug)) {
      existingSlugs.add(item.slug);
      combined.push(item);
    }
  }

  return NextResponse.json({
    success: true,
    total: combined.length,
    guides: combined,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: "Judul dan slug panduan belanja wajib diisi." },
        { status: 400 }
      );
    }

    const current = readCustomGuidesFromFile();
    const newGuide: BuyingGuide = {
      ...body,
      id: body.id || `guide-${Date.now()}`,
      itemCount: Number(body.itemCount) || (Array.isArray(body.products) ? body.products.length : 0),
    };

    // 1. Simpan ke Supabase Database jika tabel siap
    try {
      await supabaseAdmin.from("guides").upsert(
        {
          id: newGuide.id,
          slug: newGuide.slug,
          title: newGuide.title,
          subtitle: newGuide.subtitle,
          category: newGuide.category,
          category_name: newGuide.categoryName,
          cover_image: newGuide.coverImage,
          excerpt: newGuide.excerpt,
          item_count: newGuide.itemCount,
          is_featured: Boolean(newGuide.isFeatured),
          read_time: newGuide.readTime,
          author: newGuide.author,
          intro: newGuide.intro,
          quick_picks: newGuide.quickPicks,
          products: newGuide.products,
          buying_advice: newGuide.buyingAdvice,
          faqs: newGuide.faqs,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      );
    } catch (dbErr) {
      console.warn("Catatan: Tabel Supabase 'guides' belum siap:", dbErr);
    }

    // 2. Simpan ke Local File Storage Persisten
    const updated = [newGuide, ...current.filter((g) => g.slug !== newGuide.slug && g.id !== newGuide.id)];
    writeCustomGuidesToFile(updated);

    return NextResponse.json({
      success: true,
      message: "Panduan belanja berhasil disimpan di Supabase & Server Cache",
      guide: newGuide,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memproses pembuatan panduan belanja." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id && !body.slug) {
      return NextResponse.json(
        { error: "ID atau slug panduan wajib disertakan untuk update." },
        { status: 400 }
      );
    }

    // 1. Update di Supabase Database jika ada
    try {
      if (body.slug) {
        await supabaseAdmin
          .from("guides")
          .update({
            title: body.title,
            subtitle: body.subtitle,
            category: body.category,
            category_name: body.categoryName,
            cover_image: body.coverImage,
            excerpt: body.excerpt,
            item_count: body.itemCount,
            is_featured: Boolean(body.isFeatured),
            read_time: body.readTime,
            intro: body.intro,
            quick_picks: body.quickPicks,
            products: body.products,
            buying_advice: body.buyingAdvice,
            faqs: body.faqs,
            updated_at: new Date().toISOString(),
          })
          .eq("slug", body.slug);
      }
    } catch (dbErr) {
      // ignore
    }

    // 2. Update di Local File Cache
    const current = readCustomGuidesFromFile();
    const updated = current.map((g) =>
      g.id === body.id || g.slug === body.slug ? { ...g, ...body } : g
    );
    writeCustomGuidesToFile(updated);

    return NextResponse.json({
      success: true,
      message: "Panduan belanja berhasil diperbarui.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memperbarui panduan belanja." },
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
        { error: "ID atau slug panduan wajib disertakan untuk menghapus." },
        { status: 400 }
      );
    }

    // 1. Hapus dari Supabase Database
    try {
      if (id) {
        await supabaseAdmin.from("guides").delete().eq("id", id);
      } else if (slug) {
        await supabaseAdmin.from("guides").delete().eq("slug", slug);
      }
    } catch (dbErr) {
      // ignore
    }

    // 2. Hapus dari Local File Cache
    const current = readCustomGuidesFromFile();
    const updated = current.filter((g) => (id ? g.id !== id : g.slug !== slug));
    writeCustomGuidesToFile(updated);

    return NextResponse.json({
      success: true,
      message: "Panduan belanja berhasil dihapus.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menghapus panduan belanja." },
      { status: 500 }
    );
  }
}
