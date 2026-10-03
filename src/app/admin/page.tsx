"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Tag,
  ShoppingBag,
  Newspaper,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  Server
} from "lucide-react";
import { BUYING_GUIDES, MOCK_PRODUCTS, MOCK_NEWS } from "@/data/mockData";
import { getDynamicCategories } from "@/lib/dynamicCategories";
import { getDifyDrafts, DifyDraft, updateDraftStatus } from "@/lib/dify";

export default function AdminDashboardPage() {
  const [categoriesCount, setCategoriesCount] = useState(6);
  const [drafts, setDrafts] = useState<DifyDraft[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setCategoriesCount(getDynamicCategories().length);
    setDrafts(getDifyDrafts());
  }, []);

  const handlePublishDraft = (id: string, title: string) => {
    const updated = updateDraftStatus(id, "PUBLISHED");
    setDrafts(updated);
    setToastMessage(`Draft "${title.substring(0, 30)}..." berhasil dipublikasikan ke portal live!`);
    setTimeout(() => setToastMessage(null), 3500);
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

      {/* Security & Infrastructure Status Guard */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-800" />
            <h2 className="text-sm font-bold text-blue-950 uppercase tracking-wider">
              Status Keamanan Portal & Ketahanan Beban Tinggi
            </h2>
          </div>
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
            PROTEKSI MAKSIMAL
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
            <div className="text-slate-500 font-medium">Anti Iklan Ilegal / Judol</div>
            <div className="text-blue-950 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
              <span>CSP & Frame-Guard Aktif</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Mencegah injeksi script jahat, popup, dan iframe clickjacking dari pihak luar.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
            <div className="text-slate-500 font-medium">Kapasitas Ribuan Pengunjung</div>
            <div className="text-blue-950 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
              <span>Turbopack Static Cache</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Semua halaman utama di-render statis; server merespons instan di bawah 50ms.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
            <div className="text-slate-500 font-medium">Kepatuhan Algoritma Google</div>
            <div className="text-blue-950 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
              <span>JSON-LD & Sitelinks Ready</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Sitemap.xml, robots.txt, dan rich snippet siap dideteksi bot mesin pencari.
            </p>
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
              Artikel yang di-generate dari mesin Dify Coolify kamu sebelum tayang ke publik.
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
          {drafts.map((draft) => (
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
                    className="px-3.5 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    Publikasikan
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sudah Live</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
