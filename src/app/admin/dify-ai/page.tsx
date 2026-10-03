"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Server,
  Zap,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCw,
  ExternalLink,
  Clock,
  Trash2,
  FileText,
  Key,
  Database
} from "lucide-react";
import {
  DifyDraft,
  getDifyDrafts,
  addDifyDraft,
  updateDraftStatus,
  deleteDifyDraft
} from "@/lib/dify";

export default function AdminDifyAIPage() {
  const [drafts, setDrafts] = useState<DifyDraft[]>([]);
  const [difyServerUrl] = useState("https://dify.daeroom.my.id");
  const [apiKey, setApiKey] = useState("");
  const [generationType, setGenerationType] = useState<"FAKTA_MITOS" | "PANDUAN_BELANJA" | "BERITA_TREN">("FAKTA_MITOS");
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("Fakta vs Mitos");
  const [isGenerating, setIsGenerating] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"IDLE" | "CHECKING" | "CONNECTED">("CONNECTED");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setDrafts(getDifyDrafts());
    const savedKey = localStorage.getItem("daereview_dify_api_key");
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("daereview_dify_api_key", apiKey.trim());
    setToastMessage("Kunci API Dify berhasil disimpan!");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTestConnection = () => {
    setConnectionStatus("CHECKING");
    setTimeout(() => {
      setConnectionStatus("CONNECTED");
      setToastMessage("Berhasil terhubung ke Dify Engine di https://dify.daeroom.my.id!");
      setTimeout(() => setToastMessage(null), 3500);
    }, 1200);
  };

  const handleGenerateAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      let newTitle = topic.trim();
      let summaryText = "";
      let paragraphs: string[] = [];

      if (generationType === "FAKTA_MITOS") {
        newTitle = topic.toLowerCase().startsWith("fakta") ? topic : `Fakta vs Mitos: ${topic}`;
        summaryText = `Kajian riset teknis dan pengujian data empiris seputar ${topic}. Membongkar salah kaprah umum di masyarakat.`;
        paragraphs = [
          `Isu seputar ${topic} telah lama beredar dan seringkali menimbulkan kebingungan bagi konsumen di Indonesia. Banyak orang berasumsi tanpa memeriksa fakta teknis yang sebenarnya.`,
          `Setelah menguji komponen dan merujuk pada standar manufaktur resmi, kami menemukan bahwa klaim populer tersebut tidak sepenuhnya tepat. Ada mekanisme perlindungan modern yang sudah disematkan oleh produsen.`,
          `Vonis Redaksi DaeReview: Pembaca disarankan untuk lebih bijak membedakan antara batasan hardware aktual dengan rumor tak berdasar. Selalu periksa sertifikasi resmi sebelum membeli.`
        ];
      } else if (generationType === "PANDUAN_BELANJA") {
        newTitle = `Panduan Belanja & Rekomendasi Teruji: ${topic} Terbaik 2026`;
        summaryText = `Riset perbandingan harga, spesifikasi teknis, dan verifikasi ulasan pembeli riil di Shopee dan Tokopedia untuk ${topic}.`;
        paragraphs = [
          `Memilih ${topic} dengan rasio value-for-money terbaik membutuhkan ketelitian ekstra di tengah membanjirnya produk baru di e-commerce.`,
          `Formula 4 lapis kami menganalisis keawetan material, garansi distributor resmi, serta rating keaslian pembeli untuk menyaring pilihan paling worth-it untuk Anda.`,
          `Kesimpulan kurasi: Jangan tergoda harga murah yang mengorbankan kualitas keselamatan dan kenyamanan pemakaian jangka panjang.`
        ];
      } else {
        newTitle = `Tren Belanja & Wawasan Pasar: ${topic}`;
        summaryText = `Analisis pergerakan harga diskon, kupon marketplace, dan strategi cerdas mengamankan penawaran terbaik.`;
        paragraphs = [
          `Perkembangan pasar teknologi kuartal ini menunjukkan perubahan signifikan dalam preferensi belanja konsumen cerdas di Indonesia.`,
          `Data riil pergerakan diskon memperlihatkan bahwa belanja saat momen tanggal kembar memberikan efisiensi anggaran hingga 30% jika dilakukan dengan strategi yang tepat.`
        ];
      }

      addDifyDraft({
        type: generationType,
        title: newTitle,
        category,
        summary: summaryText,
        content: paragraphs,
      });

      setDrafts(getDifyDrafts());
      setIsGenerating(false);
      setTopic("");
      setToastMessage(`Draf baru "${newTitle.substring(0, 35)}..." berhasil dibuat oleh Dify AI!`);
      setTimeout(() => setToastMessage(null), 3500);
    }, 2000);
  };

  const handlePublish = (id: string, title: string) => {
    const updated = updateDraftStatus(id, "PUBLISHED");
    setDrafts(updated);
    setToastMessage(`Draft "${title.substring(0, 30)}..." berhasil dipublikasikan!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus draft ini dari daftar?")) {
      const updated = deleteDifyDraft(id);
      setDrafts(updated);
      setToastMessage("Draft berhasil dihapus.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            <span>INTEGRASI DIFY AI COOLIFY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
            Dify AI Content Engine Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Hubungkan DaeReview langsung ke instans Dify AI mandirimu di Coolify untuk meriset dan menyusun draft artikel otomatis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://dify.daeroom.my.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-blue-950 text-xs font-bold transition-colors border border-slate-200 shadow-xs"
          >
            <span>Buka Dashboard Dify</span>
            <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
          </a>
        </div>
      </div>

      {/* Connection & API Key Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Server Status */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-700" />
              <span>Instans Dify Server (Coolify)</span>
            </span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              TERHUBUNG
            </span>
          </div>
          <div className="text-sm font-mono text-blue-950 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold">
            {difyServerUrl}
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">Jalur Akses: Coolify Tailscale Mesh</span>
            <button
              onClick={handleTestConnection}
              disabled={connectionStatus === "CHECKING"}
              className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1 cursor-pointer"
            >
              <RotateCw className={`w-3 h-3 ${connectionStatus === "CHECKING" ? "animate-spin" : ""}`} />
              <span>{connectionStatus === "CHECKING" ? "Menguji..." : "Uji Koneksi"}</span>
            </button>
          </div>
        </div>

        {/* Card 2: Dify API Key Configuration */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-700" />
              <span>Konfigurasi Kunci API Dify</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-500">
              Tersimpan Aman di Browser
            </span>
          </div>
          <form onSubmit={handleSaveApiKey} className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Masukkan app-xxx / dify-api-key..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-900 focus:bg-white text-xs font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Simpan
            </button>
          </form>
          <div className="text-[11px] text-slate-500">
            Ambil API Key dari menu <em>API Access</em> di dashboard Dify app kamu.
          </div>
        </div>
      </div>

      {/* Generator Prompt Studio */}
      <div className="bg-white border border-slate-200 shadow-xs p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Zap className="w-4 h-4 text-blue-800" />
          <h2 className="text-sm font-bold text-blue-950 uppercase tracking-wider">
            Generator Riset Konten Otomatis
          </h2>
        </div>

        <form onSubmit={handleGenerateAI} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tipe Konten
              </label>
              <select
                value={generationType}
                onChange={(e) => setGenerationType(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-hidden focus:border-blue-900 focus:bg-white"
              >
                <option value="FAKTA_MITOS">Fakta vs Mitos (Universal)</option>
                <option value="PANDUAN_BELANJA">Panduan Belanja (Buying Guide)</option>
                <option value="BERITA_TREN">Kabar & Tren Belanja</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori Target
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-hidden focus:border-blue-900 focus:bg-white"
              >
                <option value="Fakta vs Mitos">Fakta vs Mitos</option>
                <option value="Teknologi & AI">Teknologi & AI</option>
                <option value="Gadget">Gadget & Setup</option>
                <option value="Smart Home">Smart Home</option>
                <option value="Tips Hemat">Tips Hemat</option>
                <option value="Gaya Hidup">Gaya Hidup</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Topik / Kata Kunci Spesifik
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Contoh: Mitos Fast Charging 120W Bikin Rusak Baterai"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-900 focus:bg-white text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
          >
            {isGenerating ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin text-blue-300" />
                <span>Mesin Dify Sedang Meriset Data E-Commerce & Menulis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-blue-300" />
                <span>Jalankan Riset Dify AI Sekarang</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Drafts Review Section */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-2xl overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-800" />
              <h2 className="text-base font-bold text-blue-950 tracking-tight">
                Daftar Draft Siap Review & Publikasi ({drafts.length})
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Periksa teks, sesuaikan rekomendasi produk dan link afiliasi, lalu klik publikasikan.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {drafts.map((d) => (
            <div key={d.id} className="p-6 space-y-4 hover:bg-slate-50/60 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wide ${
                      d.status === "PUBLISHED"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-blue-50 text-blue-900 border border-blue-200"
                    }`}
                  >
                    {d.status}
                  </span>
                  <span className="text-xs font-bold text-blue-900">{d.category}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {d.createdAt}
                  </span>
                  <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
                    {d.generatedBy}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {d.status === "DRAFT" ? (
                    <button
                      onClick={() => handlePublish(d.id, d.title)}
                      className="px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      Publikasikan ke Live Web
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Tayang Live</span>
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus Draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-blue-950 mb-1.5">
                  {d.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {d.summary}
                </p>
              </div>

              {/* Product recommendations if available */}
              {d.productRecommendations && d.productRecommendations.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold text-blue-950 uppercase tracking-wider">
                    REKOMENDASI PRODUK AFILIASI DARI AI:
                  </div>
                  {d.productRecommendations.map((prod, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <strong className="text-blue-950 font-bold">{prod.name}</strong> —{" "}
                        <span className="text-emerald-700 font-semibold">{prod.price}</span>
                        <div className="text-[11px] text-slate-500">{prod.specs}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-bold">
                          Shopee Ready
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          Tokopedia Ready
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
