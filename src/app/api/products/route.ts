import { NextResponse } from "next/server";
import { MOCK_PRODUCTS, Product } from "@/data/mockData";
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

export async function GET() {
  const custom = readCustomProductsFromFile();
  const customIds = new Set(custom.map((c) => c.id));
  const fallback = MOCK_PRODUCTS.filter((item) => !customIds.has(item.id));
  return NextResponse.json({
    success: true,
    total: custom.length + fallback.length,
    products: [...custom, ...fallback],
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
      specs: body.specs || { "Garansi": "1 Tahun Resmi" },
      shopeeUrl: body.shopeeUrl || "",
      tokopediaUrl: body.tokopediaUrl || "",
      tiktokUrl: body.tiktokUrl || "",
      verifiedOfficial: body.verifiedOfficial ?? true,
      verdict: body.verdict || "Produk teruji dengan rasio nilai-ke-harga tinggi untuk konsumen cerdas.",
      isCustom: true,
    };

    const updated = [newProduct, ...current.filter((p) => p.id !== newProduct.id)];
    writeCustomProductsToFile(updated);

    return NextResponse.json({
      success: true,
      message: "Produk berhasil ditambahkan",
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
      message: "Produk berhasil diperbarui",
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

    const current = readCustomProductsFromFile();
    const updated = current.filter((p) => p.id !== id);
    writeCustomProductsToFile(updated);

    return NextResponse.json({
      success: true,
      message: "Produk berhasil dihapus.",
      id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menghapus produk." },
      { status: 500 }
    );
  }
}
