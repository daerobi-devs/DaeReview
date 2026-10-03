import { MOCK_NEWS, NewsArticle } from "@/data/mockData";

const STORAGE_KEY = "daereview_custom_articles_v1";
export const NEWS_UPDATE_EVENT = "daereview_news_updated";

/**
 * Mengambil semua artikel kustom yang disimpan di browser
 */
export function getCustomArticles(): NewsArticle[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("Gagal membaca custom articles:", err);
    return [];
  }
}

/**
 * Mengambil seluruh artikel terpadu (kustom + bawaan MOCK_NEWS)
 * Artikel kustom ditaruh di paling awal (terbaru)
 */
export function getAllArticles(): NewsArticle[] {
  const custom = getCustomArticles();
  // Filter out any duplicates by slug or ID
  const customSlugs = new Set(custom.map((c) => c.slug));
  const fallback = MOCK_NEWS.filter((item) => !customSlugs.has(item.slug));
  return [...custom, ...fallback];
}

/**
 * Mencari satu artikel berdasarkan slug
 */
export function findArticleBySlug(slug: string): NewsArticle | undefined {
  const all = getAllArticles();
  return all.find((item) => item.slug === slug);
}

/**
 * Menyimpan artikel baru
 */
export function saveArticle(
  articleData: Omit<NewsArticle, "id" | "date"> & { id?: string; date?: string }
): NewsArticle {
  const current = getCustomArticles();

  const newArticle: NewsArticle = {
    ...articleData,
    id: articleData.id || `custom-${Date.now()}`,
    date: articleData.date || new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date()),
    isCustom: true,
  };

  // Simpan ke local storage
  const updated = [newArticle, ...current.filter((a) => a.slug !== newArticle.slug)];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(NEWS_UPDATE_EVENT, { detail: newArticle }));
  }

  return newArticle;
}

/**
 * Mengubah / mengedit artikel yang sudah ada
 * Jika artikel berasal dari MOCK_NEWS, otomatis dikonversi menjadi custom override
 */
export function updateArticle(
  id: string,
  updatedData: Partial<NewsArticle>
): NewsArticle | null {
  const current = getCustomArticles();
  const existing = current.find((a) => a.id === id);

  if (!existing) {
    const mock = MOCK_NEWS.find((m) => m.id === id);
    const base: NewsArticle = mock || {
      id,
      title: updatedData.title || "Artikel Baru",
      slug: updatedData.slug || `artikel-${id}`,
      category: updatedData.category || "Teknologi & AI",
      date: new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
      readTime: "4 menit",
      author: updatedData.author || "Tim Riset DaeReview",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
      summary: "",
      content: [],
      isCustom: true,
      status: updatedData.status || "draft",
    };

    const newOverride: NewsArticle = {
      ...base,
      ...updatedData,
      id,
      isCustom: true,
    };

    const updated = [newOverride, ...current.filter((a) => a.id !== id && a.slug !== newOverride.slug)];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(NEWS_UPDATE_EVENT, { detail: newOverride }));
    }
    return newOverride;
  }

  const updatedArticle: NewsArticle = {
    ...existing,
    ...updatedData,
    id,
    isCustom: true,
  };

  const updated = current.map((a) => (a.id === id ? updatedArticle : a));
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(NEWS_UPDATE_EVENT, { detail: updatedArticle }));
  }

  return updatedArticle;
}

/**
 * Menghapus artikel kustom
 */
export function deleteCustomArticle(articleId: string): boolean {
  const current = getCustomArticles();
  const filtered = current.filter((a) => a.id !== articleId);

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent(NEWS_UPDATE_EVENT));
  }

  return true;
}

/**
 * Helper untuk membuat URL slug yang SEO friendly
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Ganti spasi dengan -
    .replace(/[^\w\-]+/g, "") // Hapus karakter non-alfanumerik kecuali -
    .replace(/\-\-+/g, "-") // Ganti beberapa - dengan satu -
    .replace(/^-+/, "") // Potong - di awal
    .replace(/-+$/, ""); // Potong - di akhir
}
