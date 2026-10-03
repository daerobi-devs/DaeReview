/**
 * Universal Affiliate Engine — DaeReview
 * Memastikan setiap klik ke marketplace menghasilkan rujukan yang tepat,
 * tidak pernah menuju homepage kosong, dan selalu membawa identifikasi analitik/afiliasi.
 */

export interface AffiliateLinkOptions {
  store: "shopee" | "tokopedia" | "tiktok" | string;
  rawUrl?: string;
  productName: string;
  subId?: string;
}

export function buildAffiliateUrl({
  store,
  rawUrl = "",
  productName,
  subId = "daereview",
}: AffiliateLinkOptions): string {
  const cleanUrl = (rawUrl || "").trim();
  const encodedName = encodeURIComponent(productName.trim());

  if (store === "shopee") {
    // 1. Jika URL adalah homepage polos, arahkan langsung ke halaman pencarian produk
    if (!cleanUrl || cleanUrl === "https://shopee.co.id" || cleanUrl === "https://shopee.co.id/") {
      return `https://shopee.co.id/search?keyword=${encodedName}&utm_source=daereview&utm_medium=affiliate&utm_campaign=product_table`;
    }

    // 2. Jika URL produk spesifik, sematkan parameter pelacak
    try {
      const parsed = new URL(cleanUrl);
      if (!parsed.searchParams.has("utm_source")) {
        parsed.searchParams.set("utm_source", "daereview");
        parsed.searchParams.set("utm_medium", "affiliate");
        parsed.searchParams.set("utm_campaign", subId);
      }
      return parsed.toString();
    } catch {
      return cleanUrl;
    }
  }

  if (store === "tokopedia") {
    // 1. Jika URL adalah homepage polos
    if (
      !cleanUrl ||
      cleanUrl === "https://tokopedia.com" ||
      cleanUrl === "https://www.tokopedia.com" ||
      cleanUrl === "https://tokopedia.com/" ||
      cleanUrl === "https://www.tokopedia.com/"
    ) {
      return `https://www.tokopedia.com/search?q=${encodedName}&utm_source=daereview&utm_medium=affiliate&utm_campaign=product_table`;
    }

    // 2. Jika URL produk spesifik
    try {
      const parsed = new URL(cleanUrl);
      if (!parsed.searchParams.has("utm_source")) {
        parsed.searchParams.set("utm_source", "daereview");
        parsed.searchParams.set("utm_medium", "affiliate");
        parsed.searchParams.set("utm_campaign", subId);
      }
      return parsed.toString();
    } catch {
      return cleanUrl;
    }
  }

  if (store === "tiktok") {
    if (
      !cleanUrl ||
      cleanUrl === "https://tiktok.com" ||
      cleanUrl === "https://www.tiktok.com" ||
      cleanUrl === "https://tiktok.com/"
    ) {
      return `https://www.tiktok.com/search?q=${encodedName}`;
    }
    return cleanUrl;
  }

  return cleanUrl || `https://google.com/search?q=${encodedName}`;
}
