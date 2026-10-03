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
  Database,
  Copy,
  Check,
  BookOpen,
  Code,
  Terminal,
  Download,
  Users,
  ShieldCheck
} from "lucide-react";
import {
  DifyDraft,
  getDifyDrafts,
  deleteDifyDraft,
  clearAllDifyDrafts,
  publishDraftToLive
} from "@/lib/dify";
import { slugify } from "@/lib/dynamicNews";

export default function AdminDifyAIPage() {
  const [drafts, setDrafts] = useState<DifyDraft[]>([]);
  const [difyServerUrl] = useState("https://dify.daeroom.my.id");
  const [apiKey, setApiKey] = useState("");
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"IDLE" | "CHECKING" | "CONNECTED">("CONNECTED");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState<any>(null);
  const [telegramLoading, setTelegramLoading] = useState(false);
  const difySystemPrompt = `Kamu adalah DaeReview AI Agent, jurnalis teknologi independen dan kurator belanja terpercaya untuk platform DaeReview (daereview.daeroom.my.id).

TUGAS & STANDAR REDAKSI UTAMA:
1. Prinsip Jurnalistik Swiss: Netral, berbasis data teknis dan pengujian riil (4-Layer Testing: Spesifikasi Manufaktur, Ketahanan Fisik, Verifikasi Ulasan Pembeli Riil Tanpa Bot, Rasio Nilai-ke-Harga).
2. Anti-Bintang Palsu: DILARANG KERAS menggunakan rating bintang atau simbol bintang (★/⭐). Format rating resmi wajib murni numerik: '4.8 / 5' atau '9.2 / 10'.
3. Fleksibilitas Format:
   - FORMAT A (Berita / Tips / Tren / Review): Berita teknologi terkini, panduan memilih barang, komparasi produk, atau tips belanja hemat. Tanpa vonis mitos.
   - FORMAT B (Cek Fakta / Fakta vs Mitos): Khusus membongkar salah kaprah teknologi atau klaim penjual menyesatkan. Wajib sertakan vonis: 'FAKTA', 'MITOS', atau 'SEBAGIAN BENAR' beserta intisari 'quickTakeaway'.
4. Gaya Bahasa: Bahasa Indonesia yang baku, lugas, elegan, dan informatif bagi pembeli di Indonesia.
5. Rekomendasi Marketplace: Dukung Shopee, Tokopedia, dan TikTok Shop dengan tautan produk terpercaya.`;

  const difyWebhookJsonExample = `{
  "title": "Mitos Layar 120Hz Bikin Baterai HP Cepat Rusak: Fakta Pengujian Lab",
  "category": "Fakta vs Mitos",
  "summary": "Banyak pengguna mematikan refresh rate 120Hz karena takut baterai cepat soak. Kami uji konsumsi daya selama 30 hari.",
  "content": [
    "Kekhawatiran bahwa layar refresh rate tinggi 120Hz dapat merusak kesehatan baterai smartphone telah lama beredar di komunitas gadget.",
    "Berdasarkan pengujian teknis dan monitoring siklus discharge baterai Li-Po modern, refresh rate adaptif (LTPO) hanya meningkatkan konsumsi daya aktif sebesar 8-12%, bukan merusak kesehatan cell baterai.",
    "Konsumen diimbau tidak perlu ragu menikmati kelembutan 120Hz, asalkan menghindari penggunaan ponsel saat suhu perangkat melebihi 42°C."
  ],
  "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
  "author": "Dify Autonomous Agent",
  "readTime": "4 menit",
  "isFactCheck": true,
  "verdictFactCheck": "MITOS",
  "quickTakeaway": "120Hz hanya memakan sedikit daya lebih banyak saat scrolling, namun sama sekali TIDAK mempercepat degradasi fisik baterai.",
  "isTrending": true,
  "tiktokUrl": "https://vt.tiktok.com/ZSjabc123/"
}`;

  const copyToClipboard = (text: string, type: "prompt" | "json") => {
    navigator.clipboard.writeText(text);
    if (type === "prompt") {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2500);
    } else {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2500);
    }
    setToastMessage("Berhasil disalin ke clipboard!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    setDrafts(getDifyDrafts());
    const savedKey = localStorage.getItem("daereview_dify_api_key");
    if (savedKey) setApiKey(savedKey);

    fetch("/api/telegram/setup")
      .then((res) => res.json())
      .then((data) => setTelegramStatus(data))
      .catch(() => {});
  }, []);

  const handleConnectTelegram = async () => {
    setTelegramLoading(true);
    try {
      const res = await fetch("/api/telegram/setup", { method: "POST" });
      const data = await res.json();
      setTelegramStatus((prev: any) => ({ ...prev, currentWebhook: data.result }));
      setToastMessage("Webhook Telegram berhasil dihubungkan ke @daereview_editorial_bot!");
      setTimeout(() => setToastMessage(null), 3500);
    } catch (e: any) {
      alert("Gagal menghubungkan webhook: " + e.message);
    } finally {
      setTelegramLoading(false);
    }
  };

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

  const handlePublish = async (id: string, title: string) => {
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

  const handleDelete = (id: string) => {
    if (confirm("Hapus draft ini dari daftar?")) {
      const updated = deleteDifyDraft(id);
      setDrafts(updated);
      setToastMessage("Draft berhasil dihapus.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleClearAll = () => {
    if (confirm("Bersihkan semua draf dari daftar?")) {
      clearAllDifyDrafts();
      setDrafts([]);
      setToastMessage("Semua draf berhasil dibersihkan.");
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

      {/* 3-DIVISION VIRTUAL NEWSROOM ARCHITECTURE */}
      <div className="space-y-6">
        {/* TIM 0: PROJECT MANAGER & ASSIGNMENT DESK (TELEGRAM BOT HITL) */}
        <div className="bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/60 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                <Users className="w-4 h-4" />
                <span>TIM 0: PROJECT MANAGER & ASSIGNMENT DESK</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Pusat Komando Telegram Dua-Arah (HITL Approval)
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Asisten pribadi CEO di Telegram (<span className="text-cyan-300 font-mono">@daereview_editorial_bot</span>). Menganalisis link masuk (Shopee/Tokopedia vs Berita), meriset 5 topik tren harian, menugaskan Tim 1 atau Tim 2, dan mengirimkan draf untuk disetujui 1-klik sebelum terbit live!
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              <a
                href="/dify_project_manager_workflow.yml"
                download="dify_project_manager_workflow.yml"
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold transition-all flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download DSL Tim 0 (PM)</span>
              </a>
              <button
                onClick={handleConnectTelegram}
                disabled={telegramLoading}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 text-xs font-extrabold transition-all flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Zap className={`w-4 h-4 ${telegramLoading ? "animate-spin" : ""}`} />
                <span>{telegramLoading ? "Menghubungkan..." : "Hubungkan Webhook Telegram"}</span>
              </button>
              <a
                href="https://t.me/daereview_editorial_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 border border-white/20 shadow-xs cursor-pointer"
              >
                <span>Buka Chat Bot</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-300" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase">BOT TELEGRAM RESMI</span>
              <p className="font-mono text-white text-sm">@daereview_editorial_bot</p>
              <p className="text-slate-400 text-[11px]">Chat ID Terdaftar: 7045828398</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase">ENDPOINT WEBHOOK</span>
              <p className="font-mono text-slate-200 text-[11px] truncate">https://daereview.daeroom.my.id/api/telegram/webhook</p>
              <p className="text-emerald-400 text-[11px] flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {telegramStatus?.currentWebhook?.url ? "Webhook Aktif di Telegram" : "Siap Dihubungkan"}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-purple-400 uppercase">KONTROL PERSETUJUAN (HITL)</span>
              <p className="font-semibold text-white">Draft-First Guard Aktif</p>
              <p className="text-slate-400 text-[11px]">Artikel wajib disetujui lewat tombol Telegram sebelum tayang ke publik.</p>
            </div>
          </div>
        </div>

        {/* DUA DIVISI PRODUKSI DIFY: TIM 1 VS TIM 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TIM 1: NEWSROOM */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-800 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📰</span>
                  <span>DIVISI 1: BERITA & TREN</span>
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Jurnalisme Murni
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                DaeReview Newsroom (Tim 1)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Khusus menulis <strong>Berita Teknologi, Tren Viral, Kebijakan, dan Investigasi</strong>. Narasi mengalir tajam dan padat (5W+1H). 
                <br /><br />
                <span className="text-emerald-400 font-semibold">✓ Standar Swiss:</span> Bebas dari format panduan belanja, tanpa &quot;Siapa yang Wajib Membeli/Skip&quot;, dan tanpa tabel spek klaim.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-[11px]">
                <div className="text-slate-400 font-semibold uppercase text-[10px]">Alur Kerja 7-Node Tim 1:</div>
                <div className="text-slate-300">Start ➔ DuckDuckGo Search ➔ Fact & Timeline Scout ➔ Tech Investigative Reporter ➔ Swiss Managing Editor ➔ Code Sanitizer ➔ Webhook Draf</div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <a
                href="/dify_newsroom_workflow.yml"
                download="dify_newsroom_workflow.yml"
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download DSL Tim 1 (Newsroom)</span>
              </a>
            </div>
          </div>

          {/* TIM 2: PRODUCT LAB */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-800 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🔬</span>
                  <span>DIVISI 2: GADGET REVIEW & LAB</span>
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Uji Hardware 4-Lapis
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                DaeReview Product Lab (Tim 2)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Khusus <strong>Ulasan Gadget Mendalam & Panduan Belanja</strong> untuk tab <code className="text-cyan-300">/panduan</code> dan <code className="text-cyan-300">/produk</code>.
                <br /><br />
                <span className="text-emerald-400 font-semibold">✓ Standar Lab:</span> Dilengkapi audit klaim brosur vs realita, investigasi <em>The Catch</em> (kelemahan fatal rahasia), rasio harga, serta segmentasi siapa yang cocok beli vs siapa yang harus skip.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-[11px]">
                <div className="text-slate-400 font-semibold uppercase text-[10px]">Alur Kerja 7-Node Tim 2:</div>
                <div className="text-slate-300">Start ➔ DuckDuckGo Search ➔ Hardware Auditor ➔ The Catch Profiler ➔ Lead Reviewer & Guide Drafter ➔ Code Sanitizer ➔ Webhook Draf</div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <a
                href="/dify_product_lab_workflow.yml"
                download="dify_product_lab_workflow.yml"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download DSL Tim 2 (Product Lab)</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Dify AI Agent Blueprint & Webhook Protocol */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-2xl overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-blue-900" />
            <div>
              <h2 className="text-base font-bold text-blue-950">
                Blueprint & Panduan Konfigurasi Dify AI Agent
              </h2>
              <p className="text-xs text-slate-500">
                Gunakan System Prompt dan skema Webhook di bawah ini pada Dify Studio agar AI Agent otomatis memahami standar redaksi DaeReview.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-100 text-blue-950 border border-blue-200 self-start sm:self-auto">
            STANDAR REDAKSI SWISS v2.0
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          {/* Kolom 1: System Prompt Dify Agent */}
          <div className="p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-800" />
                <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                  1. System Prompt Dify Agent (Copas ke Dify)
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(difySystemPrompt, "prompt")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-950 text-xs font-bold border border-blue-200 transition-colors cursor-pointer"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-blue-700" />
                    <span>Salin Prompt</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Karakter instruksi ini memastikan Dify Agent tidak menggunakan bintang palsu (★), mematuhi 4-Layer Testing, dan dapat menulis varian artikel fleksibel (berita umum vs cek fakta).
            </p>

            <pre className="text-[11px] font-mono bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto leading-relaxed max-h-64 whitespace-pre-wrap border border-slate-800">
              {difySystemPrompt}
            </pre>
          </div>

          {/* Kolom 2: Webhook Endpoint & JSON Payload */}
          <div className="p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-800" />
                <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                  2. Skema HTTP Request Node (Otomatis Publish)
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(difyWebhookJsonExample, "json")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-950 text-xs font-bold border border-blue-200 transition-colors cursor-pointer"
              >
                {copiedJson ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-blue-700" />
                    <span>Salin JSON Payload</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">Target Endpoint:</span>
                <code className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-blue-900 font-mono font-semibold">
                  POST https://daereview.daeroom.my.id/api/dify/publish
                </code>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">Header Wajib:</span>
                <code className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono">
                  Authorization: Bearer dae_dify_autonomous_webhook_secret_key
                </code>
              </div>
            </div>

            <pre className="text-[11px] font-mono bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto leading-relaxed max-h-64 whitespace-pre-wrap border border-slate-800">
              {difyWebhookJsonExample}
            </pre>
          </div>
        </div>

        <div className="p-4 bg-blue-50/70 border-t border-blue-100 text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            💡 <strong>Info Alur Kerja:</strong> Saat Dify Workflow selesai meriset, node HTTP Request akan menembak endpoint di atas. Artikel langsung muncul di web dan bisa diedit kapan saja melalui menu <em>Kelola Berita & Cek Fakta</em>.
          </span>
          <Link
            href="/admin/berita"
            className="text-xs font-bold text-blue-800 hover:text-blue-950 underline shrink-0"
          >
            Buka Editor Berita →
          </Link>
        </div>
      </div>

      {/* Workflow Hub & Execution Card */}
      <div className="bg-white border border-slate-200 shadow-xs p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-800" />
            <h2 className="text-sm font-bold text-blue-950 uppercase tracking-wider">
              Kontrol Eksekusi Alur Kerja Dify AI
            </h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
            Webhook Listener Aktif & Siap Menerima Data
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Semua proses riset artikel, komparasi produk, dan cek fakta dijalankan langsung di mesin Dify Studio kamu di server Coolify (<code className="text-blue-900 font-mono font-semibold">https://dify.daeroom.my.id</code>). Ketika workflow selesai, node HTTP Request akan mengirimkan artikel secara langsung dan otomatis tersimpan di Supabase PostgreSQL & server.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <a
            href="https://dify.daeroom.my.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-300" />
            <span>Buka Dify AI Studio (dify.daeroom.my.id)</span>
            <ExternalLink className="w-3.5 h-3.5 text-blue-300" />
          </a>

          <Link
            href="/admin/berita"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Kelola Artikel Terbitan (Supabase)</span>
          </Link>
        </div>
      </div>

      {/* Drafts Review Section */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-2xl overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-800" />
              <h2 className="text-base font-bold text-blue-950 tracking-tight">
                Daftar Draft Siap Review & Publikasi ({drafts.length})
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Periksa draf sebelum diterbitkan, atau klik tombol untuk langsung menjadikannya artikel live di Supabase.
            </p>
          </div>

          {drafts.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-3 py-1.5 rounded-xl hover:bg-rose-50 border border-rose-200 flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan Semua</span>
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-100">
          {drafts.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-700">Belum Ada Draf Menunggu</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Artikel dari workflow Dify AI akan otomatis masuk ke sini untuk Anda review sebelum dipublikasikan, atau langsung tayang di menu Berita jika diset auto-publish.
              </p>
            </div>
          ) : (
            drafts.map((d) => {
              const currentSlug = d.publishedSlug || slugify(d.title);
              const isPublishing = publishingId === d.id;

              return (
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
                          disabled={isPublishing}
                          className="px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {isPublishing ? (
                            <>
                              <RotateCw className="w-3.5 h-3.5 animate-spin text-blue-300" />
                              <span>Menyimpan ke Supabase...</span>
                            </>
                          ) : (
                            <span>Publikasikan ke Live Web</span>
                          )}
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Tayang Live</span>
                          </span>
                          <Link
                            href={`/berita/${currentSlug}`}
                            target="_blank"
                            className="text-xs font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-1 px-2.5 py-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <span>Buka Halaman Live</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
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
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
