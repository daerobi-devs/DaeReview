export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: "semua", name: "Semua Kategori", icon: "Grid", description: "Seluruh kurasi panduan belanja dan perbandingan terverifikasi" },
  { id: "gadget", name: "Gadget & Setup", icon: "Laptop", description: "Mechanical keyboard, monitor bar, aksesoris meja kerja minimalis" },
  { id: "audio", name: "Audio & TWS", icon: "Headphones", description: "Earphone TWS, headphone ANC, mikrofon USB untuk podcast & meeting" },
  { id: "smarthome", name: "Smart Home", icon: "Home", description: "Robot vacuum, smart door lock, smart lighting, otomasi IoT rumah" },
  { id: "dapur", name: "Peralatan Dapur", icon: "Coffee", description: "Air fryer low watt, blender portable, teko listrik hemat energi" },
  { id: "lifestyle", name: "Gaya Hidup", icon: "Watch", description: "Smartwatch AMOLED, timbangan digital, perlengkapan esensial harian" },
];

const STORAGE_KEY = "daereview_dynamic_categories_v2";
const EVENT_NAME = "daereview_categories_updated";

export function getDynamicCategories(): CategoryItem[] {
  if (typeof window === "undefined") {
    return DEFAULT_CATEGORIES;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_CATEGORIES;
    }
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error("Error reading dynamic categories:", e);
  }
  return DEFAULT_CATEGORIES;
}

export function saveDynamicCategories(categories: CategoryItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: categories }));
  } catch (e) {
    console.error("Error saving dynamic categories:", e);
  }
}

export function addDynamicCategory(cat: Omit<CategoryItem, "id"> & { id?: string }): CategoryItem[] {
  const current = getDynamicCategories();
  const id = cat.id || cat.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
  
  // check if exists
  const existingIndex = current.findIndex(c => c.id === id);
  let updated: CategoryItem[];
  if (existingIndex >= 0) {
    updated = current.map((c, i) => i === existingIndex ? { ...c, ...cat, id } : c);
  } else {
    updated = [...current, { ...cat, id }];
  }
  saveDynamicCategories(updated);
  return updated;
}

export function deleteDynamicCategory(id: string): CategoryItem[] {
  if (id === "semua") return getDynamicCategories(); // prevent deleting 'semua'
  const current = getDynamicCategories();
  const updated = current.filter(c => c.id !== id);
  saveDynamicCategories(updated);
  return updated;
}

export function resetDynamicCategories(): CategoryItem[] {
  saveDynamicCategories(DEFAULT_CATEGORIES);
  return DEFAULT_CATEGORIES;
}
