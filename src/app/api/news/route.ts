import { NextResponse } from "next/server";
import { MOCK_NEWS, NewsArticle } from "@/data/mockData";
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

export async function GET() {
  const custom = readCustomNewsFromFile();
  const customSlugs = new Set(custom.map((c) => c.slug));
  const fallback = MOCK_NEWS.filter((item) => !customSlugs.has(item.slug));
  return NextResponse.json({
    success: true,
    total: custom.length + fallback.length,
    articles: [...custom, ...fallback],
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
      date: body.date || new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
      isCustom: true,
    };

    const updated = [newArticle, ...current.filter((a) => a.slug !== newArticle.slug)];
    writeCustomNewsToFile(updated);

    return NextResponse.json({
      success: true,
      message: "Artikel berhasil disimpan",
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
    if (!body.id) {
      return NextResponse.json(
        { error: "ID artikel wajib disertakan untuk update." },
        { status: 400 }
      );
    }

    const current = readCustomNewsFromFile();
    const existingIndex = current.findIndex((a) => a.id === body.id);
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
      const mock = MOCK_NEWS.find((m) => m.id === body.id);
      const newArticle: NewsArticle = {
        ...(mock || {}),
        ...body,
        id: body.id,
        isCustom: true,
      };
      updated = [newArticle, ...current.filter((a) => a.slug !== newArticle.slug)];
    }

    writeCustomNewsToFile(updated);

    return NextResponse.json({
      success: true,
      message: "Artikel berhasil diperbarui",
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
    if (!id) {
      return NextResponse.json(
        { error: "Parameter id artikel wajib disertakan." },
        { status: 400 }
      );
    }

    const current = readCustomNewsFromFile();
    const filtered = current.filter((item) => item.id !== id);
    writeCustomNewsToFile(filtered);

    return NextResponse.json({
      success: true,
      message: `Artikel dengan ID ${id} berhasil dihapus.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menghapus artikel." },
      { status: 500 }
    );
  }
}
