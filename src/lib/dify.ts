import { saveArticle, slugify } from "@/lib/dynamicNews";

export interface DifyDraft {
  id: string;
  type: "PANDUAN_BELANJA" | "FAKTA_MITOS" | "BERITA_TREN";
  title: string;
  category: string;
  summary: string;
  content: string[];
  productRecommendations?: {
    name: string;
    price: string;
    specs: string;
    pros: string;
    cons: string;
    shopeeUrl?: string;
    tokopediaUrl?: string;
    tiktokUrl?: string;
  }[];
  createdAt: string;
  status: "DRAFT" | "PUBLISHED";
  generatedBy: "Dify AI Engine (v1.0)" | "Dify AI Engine (v2.0)" | "Manual Editor";
  publishedSlug?: string;
}

const STORAGE_KEY = "daereview_dify_drafts_v1";

export const INITIAL_DIFY_DRAFTS: DifyDraft[] = [];

export function getDifyDrafts(): DifyDraft[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading Dify drafts:", e);
  }
  return [];
}

export function saveDifyDrafts(drafts: DifyDraft[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  } catch (e) {
    console.error("Error saving Dify drafts:", e);
  }
}

export function addDifyDraft(
  draft: Omit<DifyDraft, "id" | "createdAt" | "status" | "generatedBy"> & {
    generatedBy?: "Dify AI Engine (v1.0)" | "Dify AI Engine (v2.0)" | "Manual Editor";
  }
): DifyDraft {
  const current = getDifyDrafts();
  const newDraft: DifyDraft = {
    ...draft,
    id: `draft-dify-${Date.now()}`,
    createdAt: new Date().toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }),
    status: "DRAFT",
    generatedBy: draft.generatedBy || "Dify AI Engine (v2.0)",
  };
  const updated = [newDraft, ...current];
  saveDifyDrafts(updated);
  return newDraft;
}

export function updateDraftStatus(
  id: string,
  status: "DRAFT" | "PUBLISHED",
  publishedSlug?: string
): DifyDraft[] {
  const current = getDifyDrafts();
  const updated = current.map((d) =>
    d.id === id ? { ...d, status, ...(publishedSlug ? { publishedSlug } : {}) } : d
  );
  saveDifyDrafts(updated);
  return updated;
}

export function deleteDifyDraft(id: string): DifyDraft[] {
  const current = getDifyDrafts();
  const updated = current.filter((d) => d.id !== id);
  saveDifyDrafts(updated);
  return updated;
}

export function clearAllDifyDrafts(): void {
  saveDifyDrafts([]);
}

/**
 * Mempublikasikan draf Dify secara nyata ke Supabase dan server cache (/api/news).
 * Memastikan artikel benar-benar aktif di /berita/[slug] tanpa 404.
 */
export async function publishDraftToLive(
  draft: DifyDraft
): Promise<{ success: boolean; slug: string; error?: string }> {
  try {
    const slug = draft.publishedSlug || slugify(draft.title);
    const isFactCheck =
      draft.type === "FAKTA_MITOS" || draft.category === "Fakta vs Mitos";

    const articleData = {
      slug,
      title: draft.title,
      category: (draft.category as any) || "Fakta vs Mitos",
      summary: draft.summary,
      content: draft.content && draft.content.length > 0 ? draft.content : [draft.summary],
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
      author: draft.generatedBy || "Dify AI Engine (v2.0)",
      readTime: "4 menit",
      isFactCheck,
      verdictFactCheck: isFactCheck ? ("FAKTA" as const) : undefined,
      quickTakeaway: draft.summary,
      isTrending: true,
      tiktokUrl: draft.productRecommendations?.[0]?.tiktokUrl || undefined,
    };

    // 1. Simpan ke local cache via saveArticle
    saveArticle(articleData);

    // 2. Simpan secara nyata ke Supabase Database & server cache via POST /api/news
    const res = await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(articleData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn("Gagal sinkronisasi /api/news saat publish draft:", err);
    }

    // 3. Update status draft ke PUBLISHED beserta slug resminya
    updateDraftStatus(draft.id, "PUBLISHED", slug);

    return { success: true, slug };
  } catch (err: any) {
    console.error("Error publishing Dify draft:", err);
    return {
      success: false,
      slug: "",
      error: err?.message || "Gagal mempublikasikan draft.",
    };
  }
}

