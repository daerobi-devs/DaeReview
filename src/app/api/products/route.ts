import { NextResponse } from "next/server";
import { MOCK_PRODUCTS, Product } from "@/data/mockData";
import { supabaseAdmin } from "@/lib/supabase";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "data", "custom_products.json");

function readCustomProductsFromFile(): Product[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Gagal membaca custom_products.json:", e);
    return [];
  }
}

function writeCustomProductsToFile(data: Product[]): boolean {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (e) {
    console.error("Gagal menulis custom_products.json:", e);
    return false;
  }
}

function mapSupabaseRowToProduct(row: any): Product {
  return {
    id: row.id,
    rank: row.rank || 1,
    badge: row.badge || "PILIHAN UTAMA",
    name: row.name,
    tagline: row.tagline,
    category: row.category,
    rating: Number(row.rating) || 4.8,
    reviewCount: row.review_count || 100,
    price: row.price,
    originalPrice: row.original_price || undefined,
    discount: row.discount || undefined,
    image: row.image,
    pros: Array.isArray(row.pros) ? row.pros : ["Material kokoh dan awet", "Garansi resmi terjamin"],
    cons: Array.isArray(row.cons) ? row.cons : ["Ketersediaan stok promo terbatas"],
    specs: typeof row.specs === "object" && row.specs !== null ? row.specs : { Garansi: "1 Tahun Resmi" },
    shopeeUrl: row.shopee_url || "",
    tokopediaUrl: row.tokopedia_url || "",
    tiktokUrl: row.tiktok_url || "",
    verifiedOfficial: row.verified_official ?? true,
    verdict: row.verdict || "Produk teruji dengan rasio nilai-ke-harga tinggi untuk konsumen cerdas.",
    isCustom: true,
  };
}

export async function GET() {
  const localCustom = readCustomProductsFromFile();
  let supabaseProducts: Product[] = [];

  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("rank", { ascending: true });

    if (!error && data && data.length > 0) {
      supabaseProducts = data.map(mapSupabaseRowToProduct);
    }
  } catch (err) {
    console.warn("Gagal membaca produk dari Supabase:", err);
  }

  // Gabungkan: Supabase > Local File > MOCK_PRODUCTS fallback
  const existingIds = new Set<string>();
  const combined: Product[] = [];

  for (const item of supabaseProducts) {
    if (!existingIds.has(item.id)) {
      existingIds.add(item.id);
      combined.push(item);
    }
  }

  for (const item of localCustom) {
    if (!existingIds.has(item.id)) {
      existingIds.add(item.id);
      combined.push(item);
    }
  }

  for (const item of MOCK_PRODUCTS) {
    if (!existingIds.has(item.id)) {
      existingIds.add(item.id);
      combined.push(item);
    }
  }

  return NextResponse.json({
    success: true,
    total: combined.length,
    products: combined,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.price) {
      return NextResponse.json(
        { error: "Nama dan harga produk wajib diisi." },
        { status: 400 }
      );
    }

    const current = readCustomProductsFromFile();
    const newProduct: Product = {
      ...body,
      id: body.id || `custom-prod-${Date.now()}`,
      rank: body.rank || current.length + MOCK_PRODUCTS.length + 1,
      badge: body.badge || "PILIHAN UTAMA",
      name: body.name.trim(),
      tagline: body.tagline || `Rekomendasi pilihan teruji untuk kategori ${body.category || "gadget"}.`,
      category: body.category || "gadget",
      rating: typeof body.rating === "number" ? body.rating : 4.8,
      reviewCount: body.reviewCount || 100,
      price: body.price.trim(),
      originalPrice: body.originalPrice || undefined,
      discount: body.discount || undefined,
      image:
        body.image ||
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      pros: Array.isArray(body.pros) ? body.pros : ["Kualitas teruji", "Harga bersaing"],
      cons: Array.isArray(body.cons) ? body.cons : ["Stok marketplace terbatas"],
      specs: body.specs || { Garansi: "1 Tahun Resmi" },
      shopeeUrl: body.shopeeUrl || "",
      tokopediaUrl: body.tokopediaUrl || "",
      tiktokUrl: body.tiktokUrl || "",
      verifiedOfficial: body.verifiedOfficial ?? true,
      verdict: body.verdict || "Produk teruji dengan rasio nilai-ke-harga tinggi untuk konsumen cerdas.",
      isCustom: true,
    };

    // 1. Simpan ke Supabase Database
    try {
      await supabaseAdmin.from("products").upsert(
        {
          id: newProduct.id,
          rank: newProduct.rank,
          badge: newProduct.badge,
          name: newProduct.name,
          tagline: newProduct.tagline,
          category: newProduct.category,
          rating: newProduct.rating,
          review_count: newProduct.reviewCount,
          price: newProduct.price,
          original_price: newProduct.originalPrice || null,
          discount: newProduct.discount || null,
          image: newProduct.image,
          pros: newProduct.pros,
          cons: newProduct.cons,
          specs: newProduct.specs,
          shopee_url: newProduct.shopeeUrl || "",
          tokopedia_url: newProduct.tokopediaUrl || "",
          tiktok_url: newProduct.tiktokUrl || null,
          verified_official: newProduct.verifiedOfficial,
          verdict: newProduct.verdict,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
    } catch (dbErr) {
      console.warn("Gagal simpan produk ke Supabase:", dbErr);
    }

    // 2. Simpan ke Local File Storage Persisten
    const updated = [newProduct, ...current.filter((p) => p.id !== newProduct.id)];
    writeCustomProductsToFile(updated);

    return NextResponse.json({
      success: true,
      message: "Produk berhasil ditambahkan ke Supabase & Server Cache",
      product: newProduct,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menyimpan produk baru." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { error: "ID produk wajib disertakan untuk update." },
        { status: 400 }
      );
    }

    // 1. Update di Supabase Database
    try {
      await supabaseAdmin
        .from("products")
        .update({
          name: body.name,
          tagline: body.tagline,
          category: body.category,
          badge: body.badge,
          price: body.price,
          original_price: body.originalPrice || null,
          discount: body.discount || null,
          rating: body.rating,
          review_count: body.reviewCount,
          image: body.image,
          pros: body.pros,
          cons: body.cons,
          specs: body.specs,
          shopee_url: body.shopeeUrl || "",
          tokopedia_url: body.tokopediaUrl || "",
          tiktok_url: body.tiktokUrl || null,
          verified_official: body.verifiedOfficial,
          verdict: body.verdict,
          updated_at: new Date().toISOString(),
        })
        .eq("id", body.id);
    } catch (dbErr) {
      console.warn("Gagal update produk di Supabase:", dbErr);
    }

    // 2. Update di Local File Storage Persisten
    const current = readCustomProductsFromFile();
    const existingIndex = current.findIndex((p) => p.id === body.id);
    let updated: Product[];

    if (existingIndex >= 0) {
      const merged: Product = {
        ...current[existingIndex],
        ...body,
        isCustom: true,
      };
      current[existingIndex] = merged;
      updated = current;
    } else {
      const mock = MOCK_PRODUCTS.find((m) => m.id === body.id);
      const newProduct: Product = {
        ...(mock || {}),
        ...body,
        id: body.id,
        isCustom: true,
      } as Product;
      updated = [newProduct, ...current.filter((p) => p.id !== newProduct.id)];
    }

    writeCustomProductsToFile(updated);

    return NextResponse.json({
      success: true,
      message: "Produk berhasil diperbarui di Supabase & Server Cache",
      product: body,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memperbarui produk." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID produk tidak ditemukan di parameter url." },
        { status: 400 }
      );
    }

    // 1. Hapus dari Supabase Database
    try {
      await supabaseAdmin.from("products").delete().eq("id", id);
    } catch (dbErr) {
      console.warn("Gagal menghapus produk dari Supabase:", dbErr);
    }

    // 2. Hapus dari Local File Storage Persisten
    const current = readCustomProductsFromFile();
    const updated = current.filter((p) => p.id !== id);
    writeCustomProductsToFile(updated);

    return NextResponse.json({
      success: true,
      message: "Produk berhasil dihapus dari Supabase & Server Cache.",
      id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menghapus produk." },
      { status: 500 }
    );
  }
}
