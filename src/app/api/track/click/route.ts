import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "data", "affiliate_clicks.json");

interface StoredClick {
  id: string;
  productId?: string;
  productName: string;
  store: "shopee" | "tokopedia" | "tiktok";
  targetUrl: string;
  sourcePage?: string;
  createdAt: string;
}

function readClicksFromFile(): StoredClick[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Gagal membaca affiliate_clicks.json:", e);
    return [];
  }
}

function writeClicksToFile(data: StoredClick[]): boolean {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // Limit to latest 1000 items to avoid file bloating
    const trimmed = data.slice(-1000);
    fs.writeFileSync(DATA_FILE, JSON.stringify(trimmed, null, 2), "utf-8");
    return true;
  } catch (e) {
    console.error("Gagal menulis affiliate_clicks.json:", e);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    let body: any;
    const text = await req.text();
    if (!text) {
      return NextResponse.json({ error: "Empty payload" }, { status: 400 });
    }

    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { productId, productName, store, targetUrl, sourcePage, createdAt } = body;

    if (!productName || !store) {
      return NextResponse.json({ error: "productName and store are required" }, { status: 400 });
    }

    const newClick: StoredClick = {
      id: "clk-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      productId: productId || undefined,
      productName: String(productName).trim(),
      store: (["shopee", "tokopedia", "tiktok"].includes(store) ? store : "shopee") as any,
      targetUrl: String(targetUrl || "").trim(),
      sourcePage: String(sourcePage || "").trim(),
      createdAt: createdAt || new Date().toISOString(),
    };

    // Save to local file
    const current = readClicksFromFile();
    current.push(newClick);
    writeClicksToFile(current);

    // Try saving to Supabase if table exists
    try {
      await supabaseAdmin.from("affiliate_clicks").insert({
        product_id: newClick.productId || null,
        product_name: newClick.productName,
        store: newClick.store,
        target_url: newClick.targetUrl,
        source_page: newClick.sourcePage || null,
        created_at: newClick.createdAt,
      });
    } catch (sbErr) {
      // Graceful fallback if table doesn't exist yet
    }

    return NextResponse.json({ success: true, clickId: newClick.id });
  } catch (error: any) {
    console.error("Error in POST /api/track/click:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    let allClicks: StoredClick[] = [];

    // 1. Try Supabase first
    try {
      const { data, error } = await supabaseAdmin
        .from("affiliate_clicks")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);

      if (!error && data && data.length > 0) {
        allClicks = data.map((row: any) => ({
          id: String(row.id),
          productId: row.product_id || undefined,
          productName: row.product_name,
          store: row.store,
          targetUrl: row.target_url,
          sourcePage: row.source_page || undefined,
          createdAt: row.created_at,
        }));
      }
    } catch {
      // Fallback
    }

    // 2. If Supabase is empty or failed, use local file
    if (allClicks.length === 0) {
      allClicks = readClicksFromFile().reverse();
    }

    // Compute stats
    const totalClicks = allClicks.length;
    const clicksByStore = {
      shopee: 0,
      tokopedia: 0,
      tiktok: 0,
    };

    const productCounts: Record<string, { name: string; clicks: number; store: string }> = {};

    for (const click of allClicks) {
      if (click.store === "shopee") clicksByStore.shopee++;
      else if (click.store === "tokopedia") clicksByStore.tokopedia++;
      else if (click.store === "tiktok") clicksByStore.tiktok++;

      const pKey = click.productName.toLowerCase();
      if (!productCounts[pKey]) {
        productCounts[pKey] = {
          name: click.productName,
          clicks: 0,
          store: click.store,
        };
      }
      productCounts[pKey].clicks++;
    }

    const topProducts = Object.values(productCounts)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    const recentClicks = allClicks.slice(0, 15);

    return NextResponse.json({
      totalClicks,
      clicksByStore,
      topProducts,
      recentClicks,
    });
  } catch (error: any) {
    console.error("Error in GET /api/track/click:", error);
    return NextResponse.json({
      totalClicks: 0,
      clicksByStore: { shopee: 0, tokopedia: 0, tiktok: 0 },
      topProducts: [],
      recentClicks: [],
    });
  }
}
