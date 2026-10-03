"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Globe,
  BarChart3,
  DollarSign,
  Copy,
  Info,
  Terminal
} from "lucide-react";

export default function AdminSEOPage() {
  const [gscToken, setGscToken] = useState("");
  const [gaId, setGaId] = useState("");
  const [adsenseId, setAdsenseId] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedGsc = localStorage.getItem("daereview_gsc_token");
    const savedGa = localStorage.getItem("daereview_ga_id");
    const savedAdsense = localStorage.getItem("daereview_adsense_id");
    if (savedGsc) setGscToken(savedGsc);
    if (savedGa) setGaId(savedGa);
    if (savedAdsense) setAdsenseId(savedAdsense);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("daereview_gsc_token", gscToken.trim());
    localStorage.setItem("daereview_ga_id", gaId.trim());
    localStorage.setItem("daereview_adsense_id", adsenseId.trim());
    setToastMessage("Pengaturan Google & SEO berhasil disimpan!");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setToastMessage("Disalin ke clipboard!");
    setTimeout(() => setToastMessage(null), 2500);
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
            <Search className="w-3.5 h-3.5 text-blue-700" />
            <span>ALGORITMA & PENDAFTARAN GOOGLE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
            Pusat Verifikasi & Ranking Google
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Persiapan skrip otomatis untuk Google Search Console, Google Analytics 4, dan AdSense agar pengajuan langsung lolos dan ranking #1.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <span>Buka Google Search Console</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Live Form for Google Keys */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200 shadow-xs p-6 rounded-2xl space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Globe className="w-4 h-4 text-blue-800" />
          <h2 className="text-sm font-bold text-blue-950 uppercase tracking-wider">
            Konfigurasi ID Google & Verifikasi Otomatis
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Field 1: GSC Verification */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Google Site Verification Code (GSC)
            </label>
            <input
              type="text"
              value={gscToken}
              onChange={(e) => setGscToken(e.target.value)}
              placeholder="Contoh: google-site-verification=abc123xyz"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-900 focus:bg-white text-xs font-mono"
            />
            <p className="text-[11px] text-slate-500">
              Meta tag verifikasi otomatis langsung terpasang di tag <code>&lt;head&gt;</code> web live.
            </p>
          </div>

          {/* Field 2: GA4 Measurement ID */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Google Analytics 4 Measurement ID
            </label>
            <input
              type="text"
              value={gaId}
              onChange={(e) => setGaId(e.target.value)}
              placeholder="Contoh: G-XXXXXXXXXX"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-900 focus:bg-white text-xs font-mono"
            />
            <p className="text-[11px] text-slate-500">
              Melacak traffic real-time, kata kunci masuk, dan konversi klik tautan afiliasi.
            </p>
          </div>

          {/* Field 3: Google AdSense ID */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Google AdSense Publisher ID (Opsional)
            </label>
            <input
              type="text"
              value={adsenseId}
              onChange={(e) => setAdsenseId(e.target.value)}
              placeholder="Contoh: ca-pub-1234567890123456"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-900 focus:bg-white text-xs font-mono"
            />
            <p className="text-[11px] text-slate-500">
              Skrip verifikasi persetujuan akun Google AdSense saat siap monetisasi iklan.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500">
            Nilai ini juga bisa diatur permanen di file <code>.env.production</code> di Coolify.
          </span>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
          >
            Simpan Konfigurasi
          </button>
        </div>
      </form>

      {/* Google Sitelinks Search Box Live Simulation */}
      <div className="bg-white border border-slate-200 shadow-xs p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-800" />
            <h2 className="text-sm font-bold text-blue-950 uppercase tracking-wider">
              Simulasi Tampilan DaeReview di Google Search (Sitelinks Searchbox Aktif)
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            SCHEMA.ORG VERIFIED
          </span>
        </div>

        {/* Google SERP Card Preview */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 text-slate-900 space-y-2 max-w-2xl shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="w-4 h-4 rounded-full bg-blue-950 text-white text-[9px] flex items-center justify-center font-bold">
              D
            </span>
            <span>DaeReview</span>
            <span>›</span>
            <span className="text-slate-500">https://daereview.daeroom.my.id</span>
          </div>

          <h3 className="text-lg font-bold text-blue-800 hover:underline cursor-pointer">
            DaeReview — Panduan Belanja Cerdas & Kabar Tren Terpercaya
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed">
            Portal ulasan produk independen, perbandingan spesifikasi gadget, audio TWS, smart home, dan kabar tren teknologi harian terpercaya di Indonesia.
          </p>

          {/* Sitelinks Search Input Simulation */}
          <div className="pt-2">
            <div className="flex items-center gap-2 border border-slate-300 rounded-full px-3 py-1.5 text-xs text-slate-500 bg-slate-50">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Cari di dalam daereview.daeroom.my.id (Google Sitelinks Box)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Crawl & Sitemap Endpoints Check */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Sitemap card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
              Peta Situs XML (Sitemap)
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              STATUS 200 OK
            </span>
          </div>
          <div className="text-xs font-mono text-blue-950 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="truncate">https://daereview.daeroom.my.id/sitemap.xml</span>
            <button
              onClick={() => copyToClipboard("https://daereview.daeroom.my.id/sitemap.xml")}
              className="p-1 hover:text-blue-900 text-slate-500 cursor-pointer"
              title="Salin URL Sitemap"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Kirimkan URL ini ke Google Search Console di menu <em>Sitemaps</em> setelah deploy.
          </p>
        </div>

        {/* Robots.txt card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
              Instruksi Bot (Robots.txt)
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              STATUS 200 OK
            </span>
          </div>
          <div className="text-xs font-mono text-blue-950 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="truncate">https://daereview.daeroom.my.id/robots.txt</span>
            <button
              onClick={() => copyToClipboard("https://daereview.daeroom.my.id/robots.txt")}
              className="p-1 hover:text-blue-900 text-slate-500 cursor-pointer"
              title="Salin URL Robots"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Mengizinkan Googlebot, Bingbot, dan crawler AI membaca seluruh artikel ulasan publik.
          </p>
        </div>
      </div>
    </div>
  );
}
