import { BUYING_GUIDES, BuyingGuide } from "@/data/mockData";

const STORAGE_KEY = "daereview_custom_guides_v1";
export const GUIDES_UPDATE_EVENT = "daereview_guides_updated";

/**
 * Mengambil semua panduan belanja kustom dari local storage browser
 */
export function getCustomGuides(): BuyingGuide[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("Gagal membaca custom guides:", err);
    return [];
  }
}

/**
 * Mengambil seluruh panduan belanja (kustom + bawaan BUYING_GUIDES)
 * Panduan kustom ditaruh di paling awal (terbaru)
 */
export function getAllGuides(): BuyingGuide[] {
  const custom = getCustomGuides();
  const customSlugs = new Set(custom.map((c) => c.slug));
  const fallback = BUYING_GUIDES.filter((item) => !customSlugs.has(item.slug));
  return [...custom, ...fallback];
}

/**
 * Mencari satu panduan belanja berdasarkan slug
 */
export function findGuideBySlug(slug: string): BuyingGuide | undefined {
  const all = getAllGuides();
  return all.find((item) => item.slug === slug);
}

/**
 * Menyimpan panduan belanja baru
 */
export function saveGuide(
  guideData: Omit<BuyingGuide, "id"> & { id?: string }
): BuyingGuide {
  const current = getCustomGuides();

  const newGuide: BuyingGuide = {
    ...guideData,
    id: guideData.id || `custom-guide-${Date.now()}`,
  };

  const updated = [newGuide, ...current.filter((g) => g.slug !== newGuide.slug && g.id !== newGuide.id)];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(GUIDES_UPDATE_EVENT, { detail: newGuide }));
  }

  return newGuide;
}

/**
 * Mengedit panduan belanja yang sudah ada
 */
export function updateGuide(
  id: string,
  updatedData: Partial<BuyingGuide>
): BuyingGuide | null {
  const current = getCustomGuides();
  const existing = current.find((g) => g.id === id);

  if (!existing) {
    const mock = BUYING_GUIDES.find((m) => m.id === id);
    if (!mock) return null;

    const newOverride: BuyingGuide = {
      ...mock,
      ...updatedData,
      id,
    };

    const updated = [newOverride, ...current.filter((g) => g.id !== id && g.slug !== newOverride.slug)];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(GUIDES_UPDATE_EVENT, { detail: newOverride }));
    }
    return newOverride;
  }

  const updatedGuide: BuyingGuide = {
    ...existing,
    ...updatedData,
  };

  const updated = current.map((g) => (g.id === id ? updatedGuide : g));
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(GUIDES_UPDATE_EVENT, { detail: updatedGuide }));
  }

  return updatedGuide;
}

/**
 * Menghapus panduan belanja kustom
 */
export function deleteCustomGuide(id: string): boolean {
  const current = getCustomGuides();
  const filtered = current.filter((g) => g.id !== id);

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent(GUIDES_UPDATE_EVENT));
  }

  return true;
}
