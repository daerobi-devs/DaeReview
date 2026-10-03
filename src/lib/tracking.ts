export interface AffiliateClickEvent {
  id?: string;
  productId?: string;
  productName: string;
  store: "shopee" | "tokopedia" | "tiktok";
  targetUrl: string;
  sourcePage?: string;
  createdAt?: string;
}

export function trackAffiliateClick(event: Omit<AffiliateClickEvent, "id" | "createdAt">) {
  try {
    const payload = JSON.stringify({
      ...event,
      createdAt: new Date().toISOString(),
      sourcePage: event.sourcePage || (typeof window !== "undefined" ? window.location.pathname : ""),
    });

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/track/click", blob);
    } else if (typeof fetch !== "undefined") {
      fetch("/api/track/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch((e) => console.warn("Failed tracking click:", e));
    }
  } catch (err) {
    console.warn("trackAffiliateClick error:", err);
  }
}
