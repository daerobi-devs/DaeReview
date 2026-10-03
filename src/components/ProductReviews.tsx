"use client";

import React from "react";
import { Product } from "@/data/mockData";
import { Check, X, ShieldCheck, ExternalLink, ArrowRight } from "lucide-react";
import AffiliateButton from "@/components/AffiliateButton";

interface ProductReviewsProps {
  products: Product[];
  activeCategory?: string;
  onSelectCategory?: (id: string) => void;
}

export default function ProductReviews({
  products,
  activeCategory = "semua",
  onSelectCategory,
}: ProductReviewsProps) {
  return (
    <section id="rekomendasi" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              PANDUAN BELANJA INDEPENDEN
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Rekomendasi Produk Teruji
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Daftar barang dengan performa terbaik, harga bersaing, dan kepuasan pembeli tertinggi.
            </p>
          </div>

          {/* Interactive Category Filter Pills */}
          {onSelectCategory && (
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "semua", name: "Semua Kategori" },
                { id: "gadget", name: "Gadget & Setup" },
                { id: "audio", name: "Audio & TWS" },
                { id: "smarthome", name: "Smart Home" },
                { id: "dapur", name: "Peralatan Dapur" },
                { id: "lifestyle", name: "Gaya Hidup" },
              ].map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Clean Minimalist Product Cards (No Clunky Nested Boxes) */}
        <div className="space-y-10">
          {products.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors p-6 sm:p-8 bg-white"
            >
              {/* Product Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 text-white font-black text-sm flex items-center justify-center shrink-0">
                    #{item.rank}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                        {item.badge}
                      </span>
                      {item.verifiedOfficial && (
                        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                          • <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Toko Resmi
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      {item.name}
                    </h3>
                  </div>
                </div>

                {/* Score & Price */}
                <div className="flex sm:flex-col sm:items-end justify-between items-center shrink-0">
                  <div className="text-xl sm:text-2xl font-black text-slate-900">
                    {item.price}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Skor: <span className="font-bold text-slate-900">{item.rating} / 5</span> ({item.reviewCount.toLocaleString("id-ID")} ulasan)
                  </div>
                </div>
              </div>

              {/* Main Body: Image + Editorial Content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-start">
                {/* Product Image Column */}
                <div className="lg:col-span-4">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 border border-slate-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {item.discount && (
                      <span className="absolute top-2.5 left-2.5 bg-slate-900 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                        Diskon {item.discount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Editorial Details Column */}
                <div className="lg:col-span-8 space-y-5">
                  {/* Natural Editorial Verdict Paragraph */}
                  <div className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                    <p className="font-medium text-slate-900 mb-1">{item.tagline}</p>
                    <p className="text-slate-600 text-xs sm:text-sm">{item.verdict}</p>
                  </div>

                  {/* Clean Pros and Cons (Text Bullets without pastel boxes) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    {/* Kelebihan */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        <span>Kelebihan</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {item.pros.map((pro, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Kekurangan */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <X className="w-3.5 h-3.5 text-rose-500 stroke-[3]" />
                        <span>Kekurangan</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {item.cons.map((con, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-rose-500 font-bold">•</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Subtle Specs Line */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Spesifikasi:</span>
                    {Object.entries(item.specs).slice(0, 3).map(([key, val]) => (
                      <span key={key}>
                        {key}: <strong className="text-slate-800">{val}</strong>
                      </span>
                    ))}
                  </div>

                  {/* Clean, Proportionate Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <AffiliateButton
                      store="shopee"
                      href={item.shopeeUrl}
                      productName={item.name}
                      productId={item.id}
                      sourcePage="/"
                      className="inline-flex items-center gap-2 bg-[#EE4D2D] hover:bg-[#d83d1e] text-white text-xs sm:text-sm font-bold py-2.5 px-5 rounded-lg transition-colors shadow-2xs"
                    >
                      <span>Cek Harga di Shopee</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </AffiliateButton>

                    <AffiliateButton
                      store="tokopedia"
                      href={item.tokopediaUrl}
                      productName={item.name}
                      productId={item.id}
                      sourcePage="/"
                      className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs sm:text-sm font-semibold py-2.5 px-5 rounded-lg transition-colors"
                    >
                      <span>Tokopedia</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </AffiliateButton>

                    {item.tiktokUrl && (
                      <AffiliateButton
                        store="tiktok"
                        href={item.tiktokUrl}
                        productName={item.name}
                        productId={item.id}
                        sourcePage="/"
                        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-semibold py-2.5 px-5 rounded-lg transition-colors shadow-2xs"
                      >
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span>TikTok Shop</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </AffiliateButton>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
