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
  generatedBy: "Dify AI Engine (v1.0)" | "Manual Editor";
}

const STORAGE_KEY = "daereview_dify_drafts_v1";

export const INITIAL_DIFY_DRAFTS: DifyDraft[] = [
  {
    id: "draft-dify-1",
    type: "FAKTA_MITOS",
    title: "Fakta vs Mitos: Benarkah Mematikan AC Saat Keluar Kamar 15 Menit Lebih Boros Listrik Inverter?",
    category: "Fakta vs Mitos",
    summary: "Analisis kompresor inverter: tarikan awal daya 800W saat starter vs mode standby 150W saat suhu stabil. Kapan sebaiknya AC dibiarkan menyala?",
    content: [
      "Banyak mitos di internet menyebutkan bahwa mematikan AC inverter untuk durasi singkat justru bikin boros karena kompresor harus bekerja keras dari nol lagi saat dinyalakan.",
      "Hasil uji teknis: Jika Anda keluar kamar kurang dari 15-20 menit, membiarkan AC inverter tetap menyala pada suhu 24-25°C justru lebih hemat karena kompresor hanya membutuhkan daya 120-180 Watt untuk mempertahankan suhu dingin yang sudah terbentuk.",
      "Namun jika Anda keluar lebih dari 45 menit, mematikan AC tetap lebih hemat secara total konsumsi kilowatt per hour (kWh)."
    ],
    createdAt: "2026-10-03 07:15",
    status: "DRAFT",
    generatedBy: "Dify AI Engine (v1.0)",
  },
  {
    id: "draft-dify-2",
    type: "PANDUAN_BELANJA",
    title: "5 Rekomendasi Timbangan Badan Digital Presisi dengan Pengukur Kadar Lemak (BIA) Terbaik 2026",
    category: "Gaya Hidup",
    summary: "Riset 12 smart scale Bluetooth dengan sensor elektroda Bioelectrical Impedance Analysis akurat untuk tracking diet dan kebugaran.",
    content: [
      "Menimbang berat badan saja tidak cukup untuk melihat progres kesehatan. Smart scale modern mengukur massa otot, lemak visceral, kadar air, dan BMR menggunakan arus mikro aman.",
      "Pilihan utama kami jatuh pada smart scale dengan 4 elektroda stainless steel 304 yang terintegrasi langsung dengan Apple Health dan Google Fit."
    ],
    productRecommendations: [
      {
        name: "Xiaomi Mi Body Composition Scale S400",
        price: "Rp 249.000",
        specs: "BIA Dual-Frequency, 25 Metrik Tubuh, Bluetooth 5.0, Baterai 180 Hari",
        pros: "Aplikasi Mi Fitness sangat rapi dan sinkronisasi instan",
        cons: "Belum mendukung pengisian daya Type-C (masih memakai 3x baterai AAA)",
        shopeeUrl: "https://shopee.co.id",
        tokopediaUrl: "https://tokopedia.com",
      },
    ],
    createdAt: "2026-10-03 06:40",
    status: "DRAFT",
    generatedBy: "Dify AI Engine (v1.0)",
  },
];

export function getDifyDrafts(): DifyDraft[] {
  if (typeof window === "undefined") {
    return INITIAL_DIFY_DRAFTS;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return INITIAL_DIFY_DRAFTS;
    }
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error("Error reading Dify drafts:", e);
  }
  return INITIAL_DIFY_DRAFTS;
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
    generatedBy?: "Dify AI Engine (v1.0)" | "Manual Editor";
  }
): DifyDraft {
  const current = getDifyDrafts();
  const newDraft: DifyDraft = {
    ...draft,
    id: `draft-dify-${Date.now()}`,
    createdAt: new Date().toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }),
    status: "DRAFT",
    generatedBy: draft.generatedBy || "Dify AI Engine (v1.0)",
  };
  const updated = [newDraft, ...current];
  saveDifyDrafts(updated);
  return newDraft;
}

export function updateDraftStatus(id: string, status: "DRAFT" | "PUBLISHED"): DifyDraft[] {
  const current = getDifyDrafts();
  const updated = current.map((d) => (d.id === id ? { ...d, status } : d));
  saveDifyDrafts(updated);
  return updated;
}

export function deleteDifyDraft(id: string): DifyDraft[] {
  const current = getDifyDrafts();
  const updated = current.filter((d) => d.id !== id);
  saveDifyDrafts(updated);
  return updated;
}
