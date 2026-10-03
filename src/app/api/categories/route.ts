import { NextResponse } from "next/server";
import { DEFAULT_CATEGORIES, CategoryItem } from "@/lib/dynamicCategories";

// In-memory runtime cache for server-side persistence
let serverCategories: CategoryItem[] = [...DEFAULT_CATEGORIES];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: serverCategories,
    count: serverCategories.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, icon, description, id } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Nama kategori wajib diisi" },
        { status: 400 }
      );
    }

    const catId =
      id || name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");

    const existingIndex = serverCategories.findIndex((c) => c.id === catId);
    const newCat: CategoryItem = {
      id: catId,
      name,
      icon: icon || "Grid",
      description: description || "",
    };

    if (existingIndex >= 0) {
      serverCategories[existingIndex] = newCat;
    } else {
      serverCategories.push(newCat);
    }

    return NextResponse.json({
      success: true,
      message: "Kategori berhasil disimpan",
      data: serverCategories,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal memproses data kategori" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || id === "semua") {
      return NextResponse.json(
        { success: false, error: "ID kategori tidak valid atau tidak boleh dihapus" },
        { status: 400 }
      );
    }

    serverCategories = serverCategories.filter((c) => c.id !== id);

    return NextResponse.json({
      success: true,
      message: `Kategori ${id} berhasil dihapus`,
      data: serverCategories,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal menghapus kategori" },
      { status: 500 }
    );
  }
}
