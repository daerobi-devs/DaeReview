import { MOCK_PRODUCTS, Product } from "@/data/mockData";

const STORAGE_KEY = "daereview_custom_products_v1";
export const PRODUCTS_UPDATE_EVENT = "daereview_products_updated";

/**
 * Mengambil semua produk kustom yang disimpan di browser
 */
export function getCustomProducts(): Product[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("Gagal membaca custom products:", err);
    return [];
  }
}

/**
 * Mengambil seluruh produk terpadu (kustom + bawaan MOCK_PRODUCTS)
 * Produk kustom ditaruh di paling awal (terbaru)
 */
export function getAllProducts(): Product[] {
  const custom = getCustomProducts();
  const customIds = new Set(custom.map((c) => c.id));
  const fallback = MOCK_PRODUCTS.filter((item) => !customIds.has(item.id));
  return [...custom, ...fallback];
}

/**
 * Mencari satu produk berdasarkan ID
 */
export function findProductById(id: string): Product | undefined {
  const all = getAllProducts();
  return all.find((item) => item.id === id);
}

/**
 * Menyimpan produk baru
 */
export function saveProduct(
  productData: Omit<Product, "id"> & { id?: string }
): Product {
  const current = getCustomProducts();

  const newProduct: Product = {
    ...productData,
    id: productData.id || `custom-prod-${Date.now()}`,
    isCustom: true,
  };

  const updated = [newProduct, ...current.filter((p) => p.id !== newProduct.id)];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(PRODUCTS_UPDATE_EVENT, { detail: newProduct }));
  }

  // Sinkronisasi async ke API server
  if (typeof window !== "undefined") {
    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    }).catch((e) => console.warn("Sync product to server warning:", e));
  }

  return newProduct;
}

/**
 * Mengubah / mengedit produk yang sudah ada
 */
export function updateProduct(
  id: string,
  updatedData: Partial<Product>
): Product | null {
  const current = getCustomProducts();
  const existing = current.find((p) => p.id === id);

  if (!existing) {
    const mock = MOCK_PRODUCTS.find((m) => m.id === id);
    if (!mock) return null;

    const newOverride: Product = {
      ...mock,
      ...updatedData,
      id,
      isCustom: true,
    };

    const updated = [newOverride, ...current.filter((p) => p.id !== id)];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(PRODUCTS_UPDATE_EVENT, { detail: newOverride }));
      fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOverride),
      }).catch((e) => console.warn("Sync update to server warning:", e));
    }
    return newOverride;
  }

  const updatedProduct: Product = {
    ...existing,
    ...updatedData,
    id,
    isCustom: true,
  };

  const updated = current.map((p) => (p.id === id ? updatedProduct : p));
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(PRODUCTS_UPDATE_EVENT, { detail: updatedProduct }));
    fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    }).catch((e) => console.warn("Sync update to server warning:", e));
  }

  return updatedProduct;
}

/**
 * Menghapus produk kustom
 */
export function deleteProduct(id: string): boolean {
  const current = getCustomProducts();
  const updated = current.filter((p) => p.id !== id);

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(PRODUCTS_UPDATE_EVENT, { detail: { id, deleted: true } }));
    fetch(`/api/products?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch((e) => console.warn("Delete product on server warning:", e));
  }

  return true;
}
