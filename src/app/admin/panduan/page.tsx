"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ExternalLink,
  Search,
  Tag,
  Star,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
  Filter
} from "lucide-react";
import { BUYING_GUIDES, MOCK_PRODUCTS, Product } from "@/data/mockData";

export default function AdminPanduanPage() {
  const [activeTab, setActiveTab] = useState<"products" | "guides">("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("Semua");

  const categories = ["Semua", "audio", "gadget", "smarthome", "dapur", "lifestyle"];

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === "Semua" || p.category.toLowerCase() === selectedCat.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const filteredGuides = BUYING_GUIDES.filter((g) =>
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
            <ShoppingBag className="w-3.5 h-3.5 text-blue-700" />
            <span>KATALOG BARANG & KOMISI AFILIASI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
            Katalog Produk & Panduan Belanja
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Lihat daftar semua barang yang sudah Anda masukkan, status link Shopee, Tokopedia, dan TikTok Shop.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#panduan"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-blue-900 text-xs font-bold transition-colors border border-slate-200 shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
            <span>Lihat di Web Live</span>
          </Link>
        </div>
      </div>

      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Barang Masuk</span>
          <p className="text-2xl font-black text-blue-950 mt-1">{MOCK_PRODUCTS.length}</p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">Siap Monetisasi Afiliasi</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Koleksi Panduan</span>
          <p className="text-2xl font-black text-blue-950 mt-1">{BUYING_GUIDES.length}</p>
          <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">Komparasi Mendalam</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Toko Mitra Resmi</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">100%</p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Official Store Terverifikasi</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Marketplace Terhubung</span>
          <p className="text-2xl font-black text-purple-700 mt-1">3 Platform</p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Shopee, Tokopedia, TikTok</span>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "products"
              ? "bg-blue-950 text-white shadow-xs"
              : "bg-white text-slate-600 hover:text-blue-950 border border-slate-200"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>📦 Daftar Barang / Produk ({MOCK_PRODUCTS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("guides")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "guides"
              ? "bg-blue-950 text-white shadow-xs"
              : "bg-white text-slate-600 hover:text-blue-950 border border-slate-200"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>📑 Koleksi Panduan Belanja ({BUYING_GUIDES.length})</span>
        </button>
      </div>

      {/* TAB 1: DAFTAR SEMUA PRODUK / BARANG */}
      {activeTab === "products" && (
        <div className="space-y-6">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama barang atau merk..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-900 text-xs shadow-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    selectedCat === cat
                      ? "bg-blue-950 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:text-blue-950 border border-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards List */}
          <div className="space-y-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          p.badge === "PILIHAN UTAMA"
                            ? "bg-blue-50 text-blue-950 border border-blue-200"
                            : p.badge === "HARGA TERBAIK"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : p.badge === "KUALITAS PREMIUM"
                            ? "bg-purple-50 text-purple-800 border border-purple-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {p.badge}
                      </span>

                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {p.category}
                      </span>

                      {p.verifiedOfficial && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Official Store
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {p.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-1 max-w-2xl">
                      {p.tagline}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                      <div>
                        <span className="text-slate-400 text-[10px] block">HARGA TERBAIK</span>
                        <span className="font-extrabold text-blue-950 text-sm">{p.price}</span>
                        {p.discount && (
                          <span className="text-[10px] font-bold text-rose-600 ml-1.5 bg-rose-50 px-1 rounded">
                            {p.discount}
                          </span>
                        )}
                      </div>

                      <div className="border-l border-slate-200 pl-3">
                        <span className="text-slate-400 text-[10px] block">SKOR AUDIT RIIL</span>
                        <div className="flex items-center gap-1 font-bold text-slate-800">
                          <span className="text-amber-500 font-extrabold">{p.rating}</span>
                          <span className="text-slate-400 text-[10px]">/ 5</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({p.reviewCount.toLocaleString("id-ID")} ulasan)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Affiliate Link Status & Test Links */}
                <div className="w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Status Tautan Komisi Afiliasi
                  </span>

                  <div className="flex flex-wrap lg:flex-col gap-2">
                    {p.shopeeUrl && (
                      <a
                        href={p.shopeeUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#EE4D2D] text-xs font-bold transition-colors"
                      >
                        <span>🟠 Shopee Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {p.tokopediaUrl && (
                      <a
                        href={p.tokopediaUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-colors"
                      >
                        <span>🟢 Tokopedia Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {p.tiktokUrl ? (
                      <a
                        href={p.tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-cyan-400 text-xs font-bold transition-colors"
                      >
                        <span>⚫ TikTok Shop</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 text-[11px]">
                        <span>TikTok Shop: Belum Terhubung</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PANDUAN BELANJA & BUYING GUIDES */}
      {activeTab === "guides" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari panduan belanja atau kategori..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-900 text-xs shadow-xs"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={guide.coverImage}
                      alt={guide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-bold text-blue-900">
                        {guide.categoryName}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">{guide.products.length} Produk Terpilih</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">Editor: {guide.author.name}</span>
                    </div>
                    <h3 className="text-base font-bold text-blue-950 leading-snug">
                      {guide.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-1">
                      {guide.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 w-full lg:w-auto justify-end border-t lg:border-t-0 border-slate-100 pt-3 lg:pt-0">
                  <Link
                    href={`/panduan/${guide.slug}`}
                    target="_blank"
                    className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-blue-950 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <span>Lihat Panduan</span>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
