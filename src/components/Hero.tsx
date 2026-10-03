"use client";

import React, { useState, useEffect } from "react";
import { MOCK_PRODUCTS } from "@/data/mockData";
import { getDynamicCategories, CategoryItem } from "@/lib/dynamicCategories";
import { ArrowRight, ExternalLink, Award, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import AffiliateButton from "@/components/AffiliateButton";

interface HeroProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export default function Hero({ activeCategory, onSelectCategory }: HeroProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    setCategories(getDynamicCategories());
    const handleUpdate = (e: any) => {
      if (e.detail) setCategories(e.detail);
      else setCategories(getDynamicCategories());
    };
    window.addEventListener("daereview_categories_updated", handleUpdate);
    return () => window.removeEventListener("daereview_categories_updated", handleUpdate);
  }, []);
  // Feature the #1 or #2 Editor's Choice product
  const featuredProduct = MOCK_PRODUCTS.find((p) => p.badge === "PILIHAN UTAMA") || MOCK_PRODUCTS[0];

  return (
    <section className="bg-white pt-8 pb-12 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Editorial Title & Category Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>EDISI OKTOBER 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Panduan Belanja & Ulasan Teruji
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-1.5 max-w-xl">
              Riset spesifikasi mendalam dan perbandingan harga nyata untuk membantumu berbelanja tanpa ragu.
            </p>
          </div>

          {/* Minimalist Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => {
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
        </div>

        {/* Editor's Choice Spotlight Banner (Wirecutter Magazine Style) */}
        <div className="mt-8 rounded-3xl bg-slate-50 border border-slate-200 p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold tracking-wide">
                <Award className="w-3.5 h-3.5 text-orange-600" />
                <span>PILIHAN EDITOR MINGGU INI</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {featuredProduct.name}
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {featuredProduct.verdict}
              </p>

              {/* Rating & Highlight Pill: Pure Numeric Minimalist */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
                  <span className="text-xs uppercase font-extrabold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                    SKOR {featuredProduct.rating}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({featuredProduct.reviewCount.toLocaleString("id-ID")} pembeli riil)
                  </span>
                </div>

                <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Struktur Gasket Mount 5 Lapis Teruji</span>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <div>
                  <span className="text-xs text-slate-500 block">Harga Rekomendasi:</span>
                  <span className="text-2xl font-black text-slate-900">{featuredProduct.price}</span>
                </div>

                <div className="flex items-center gap-3">
                  <AffiliateButton
                    store="shopee"
                    href={featuredProduct.shopeeUrl}
                    productName={featuredProduct.name}
                    productId={featuredProduct.id}
                    sourcePage="/"
                    className="inline-flex items-center gap-2 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-xs sm:text-sm font-bold py-2.5 px-5 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Cek di Shopee</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </AffiliateButton>

                  <Link
                    href="#rekomendasi"
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl border border-slate-300 transition-colors"
                  >
                    <span>Baca Ulasan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Photo Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                <img
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                  Teruji 100 Jam
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
