"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ExternalLink,
  Search
} from "lucide-react";
import { BUYING_GUIDES, MOCK_PRODUCTS } from "@/data/mockData";

export default function AdminPanduanPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGuides = BUYING_GUIDES.filter((g) =>
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
            <ShoppingBag className="w-3.5 h-3.5 text-blue-700" />
            <span>KATALOG KURASI UTAMA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
            Panduan Belanja & Produk Afiliasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau dan kelola {BUYING_GUIDES.length} buying guide aktif dan tautan komisi Shopee & Tokopedia.
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

      {/* Search Filter */}
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

      {/* Guides List */}
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
                  <span className="text-slate-500">{guide.products.length} Produk</span>
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
                <span>Preview</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
