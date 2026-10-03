"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Tag,
  ShoppingBag,
  Newspaper,
  Zap,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  Server,
  RotateCw,
  MousePointerClick,
  TrendingUp,
  BarChart3,
  ShoppingCart
} from "lucide-react";
import { BUYING_GUIDES, MOCK_PRODUCTS, MOCK_NEWS } from "@/data/mockData";
import { getDynamicCategories } from "@/lib/dynamicCategories";
import { getDifyDrafts, DifyDraft, publishDraftToLive } from "@/lib/dify";
import { slugify } from "@/lib/dynamicNews";

interface ClickStats {
  totalClicks: number;
  clicksByStore: { shopee: number; tokopedia: number; tiktok: number };
  topProducts: { name: string; clicks: number; store: string }[];
  recentClicks: { id: string; productName: string; store: string; targetUrl: string; sourcePage?: string; createdAt: string }[];
}

export default function AdminDashboardPage() {
  const [categoriesCount, setCategoriesCount] = useState(6);
  const [drafts, setDrafts] = useState<DifyDraft[]>([]);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [clickStats, setClickStats] = useState<ClickStats>({
    totalClicks: 0,
    clicksByStore: { shopee: 0, tokopedia: 0, tiktok: 0 },
    topProducts: [],
    recentClicks: [],
  });
  const [isLoadingClicks, setIsLoadingClicks] = useState(true);

  useEffect(() => {
    setCategoriesCount(getDynamicCategories().length);
    setDrafts(getDifyDrafts());

    fetch("/api/track/click")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.totalClicks === "number") {
          setClickStats(data);
        }
      })
      .catch((e) => console.warn("Failed fetching click stats:", e))
      .finally(() => setIsLoadingClicks(false));
  }, []);

  const handlePublishDraft = async (id: string, title: string) => {
    const draft = drafts.find((d) => d.id === id);
    if (!draft) return;

    setPublishingId(id);
    const result = await publishDraftToLive(draft);
    setPublishingId(null);

    if (result.success) {
      setDrafts(getDifyDrafts());
      setToastMessage(
        `Artikel "${title.substring(0, 30)}..." berhasil dipublikasikan live ke Supabase & Portal!`
      );
      setTimeout(() => setToastMessage(null), 4000);
    } else {
      alert(`Gagal mempublikasikan: ${result.error}`);
    }
  };

  const pendingDrafts = drafts.filter((d) => d.status === "DRAFT");

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            <span>KONTROL PUSAT DAEREVIEW</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
            Dashboard Editor & Mesin AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau performa kurasi belanja, draf otomatis Dify AI, dan status keamanan ribuan pembaca.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/dify-ai"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-300" />
            <span>Generate Draft Baru dengan AI</span>
          </Link>
        </div>
      </div>

      {/* Core KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 shadow-xs p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Panduan Belanja</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-800">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-950">
            {BUYING_GUIDES.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Total {MOCK_PRODUCTS.length} produk terkurasi
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 shadow-xs p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Kabar & Cek Fakta</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800">
              <Newspaper className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-950">
            {MOCK_NEWS.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Laporan tren & fakta vs mitos
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 shadow-xs p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Kategori Dinamis</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-800">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-950">
            {categoriesCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Bisa tambah & hapus fleksibel
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 shadow-xs p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Draf Dify AI Menunggu</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-800">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-900">
            {pendingDrafts.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Siap direview & dipublikasikan
          </div>
        </div>
      </div>

      {/* AFFILIATE MONETIZATION & CLICK TRACKING ANALYTICS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
              <BarChart3 className="w-3.5 h-3.5 text-blue-700" />
              <span>ANALITIK KONVERSI & AFILIASI</span>
            </div>
            <h2 className="text-xl font-black text-blue-950 tracking-tight">
              Performa Trafik Affiliate Marketplace
            </h2>
            <p className="text-xs text-slate-500">
              Pelacakan klik riil dari artikel berita, ulasan teruji, dan panduan belanja ke Shopee, Tokopedia, dan TikTok Shop.
            </p>
          </div>
          <button
            onClick={() => {
              setIsLoadingClicks(true);
              fetch("/api/track/click")
                .then((res) => res.json())
                .then((data) => {
                  if (data && typeof data.totalClicks === "number") setClickStats(data);
                })
                .finally(() => setIsLoadingClicks(false));
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoadingClicks ? "animate-spin" : ""}`} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* 4 Click Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 shadow-xs p-5 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Klik Keluar</span>
            <div className="text-2xl sm:text-3xl font-black text-blue-950 mt-1 flex items-center gap-2">
              <MousePointerClick className="w-6 h-6 text-blue-800" />
              <span>{clickStats.totalClicks}</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Semua Sumber Terlacak</span>
          </div>

          <div className="bg-white border border-slate-200 shadow-xs p-5 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Shopee Affiliate</span>
            <div className="text-2xl sm:text-3xl font-black text-[#EE4D2D] mt-1">
              {clickStats.clicksByStore.shopee}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {clickStats.totalClicks > 0
                ? `${Math.round((clickStats.clicksByStore.shopee / clickStats.totalClicks) * 100)}% dari total klik`
                : "Belum ada klik"}
            </span>
          </div>

          <div className="bg-white border border-slate-200 shadow-xs p-5 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tokopedia Affiliate</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
              {clickStats.clicksByStore.tokopedia}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {clickStats.totalClicks > 0
                ? `${Math.round((clickStats.clicksByStore.tokopedia / clickStats.totalClicks) * 100)}% dari total klik`
                : "Belum ada klik"}
            </span>
          </div>

          <div className="bg-white border border-slate-200 shadow-xs p-5 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TikTok Shop</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {clickStats.clicksByStore.tiktok}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {clickStats.totalClicks > 0
                ? `${Math.round((clickStats.clicksByStore.tiktok / clickStats.totalClicks) * 100)}% dari total klik`
                : "Belum ada klik"}
            </span>
          </div>
        </div>

        {/* Breakdown Grid: Top Products & Realtime Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Products */}
          <div className="bg-white border border-slate-200 shadow-xs rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-blue-950">Top Produk Paling Diminati</h3>
            </div>
            {clickStats.topProducts.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Belum ada rekaman klik produk. Begitu pembaca mengklik cek harga di web, data otomatis tampil di sini.
              </p>
            ) : (
              <div className="space-y-2">
                {clickStats.topProducts.slice(0, 5).map((prod, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-blue-950 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-slate-800 truncate">{prod.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 uppercase">
                        {prod.store}
                      </span>
                      <span className="font-black text-blue-950">{prod.clicks} klik</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Clicks Activity Feed */}
          <div className="bg-white border border-slate-200 shadow-xs rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <Clock className="w-4 h-4 text-blue-800" />
              <h3 className="text-sm font-bold text-blue-950">Aktivitas Klik Terbaru (Live Feed)</h3>
            </div>
            {clickStats.recentClicks.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Belum ada aktivitas klik affiliate tercatat.
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {clickStats.recentClicks.slice(0, 8).map((clk) => (
                  <div key={clk.id} className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-slate-800 truncate">{clk.productName}</p>
                      <p className="text-[10px] text-slate-400">Dari: {clk.sourcePage || "/"}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        clk.store === "shopee"
                          ? "bg-orange-50 text-[#EE4D2D] border border-orange-200"
                          : clk.store === "tokopedia"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-800"
                      }`}>
                        {clk.store}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dify AI Drafts Table */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-2xl overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-800" />
              <h2 className="text-base font-bold text-blue-950 tracking-tight">
                Draf Hasil Riset Dify AI Terbaru
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Artikel yang di-generate dari mesin Dify AI kamu sebelum tayang ke publik.
            </p>
          </div>
          <Link
            href="/admin/dify-ai"
            className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1"
          >
            <span>Buka AI Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {drafts.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Sparkles className="w-6 h-6 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-700">Belum Ada Draf Menunggu</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Artikel dari Dify Studio yang dikirim via webhook akan otomatis muncul di sini atau langsung tayang di portal.
              </p>
            </div>
          ) : (
            drafts.map((draft) => {
              const currentSlug = draft.publishedSlug || slugify(draft.title);
              const isPublishing = publishingId === draft.id;

              return (
                <div
                  key={draft.id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wide ${
                          draft.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-blue-50 text-blue-900 border border-blue-200"
                        }`}
                      >
                        {draft.status}
                      </span>
                      <span className="text-xs font-bold text-blue-900">
                        {draft.category}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {draft.createdAt}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-blue-950">
                      {draft.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {draft.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {draft.status === "DRAFT" ? (
                      <button
                        onClick={() => handlePublishDraft(draft.id, draft.title)}
                        disabled={isPublishing}
                        className="px-3.5 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {isPublishing ? (
                          <>
                            <RotateCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Menyimpan...</span>
                          </>
                        ) : (
                          <span>Publikasikan</span>
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Sudah Live</span>
                        </span>
                        <Link
                          href={`/berita/${currentSlug}`}
                          target="_blank"
                          className="text-xs font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-1 px-2.5 py-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <span>Buka Live</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
