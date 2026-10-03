"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BUYING_GUIDES } from "@/data/mockData";
import { getDynamicCategories, CategoryItem } from "@/lib/dynamicCategories";
import { ArrowRight, BookOpen, Clock, Calendar, Sparkles, ShieldCheck } from "lucide-react";

export default function BuyingGuidesHub() {
  const [selectedCategory, setSelectedCategory] = useState("semua");
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

  const filteredGuides =
    selectedCategory === "semua"
      ? BUYING_GUIDES
      : BUYING_GUIDES.filter((g) => g.category === selectedCategory);

  const featuredGuide = filteredGuides[0] || BUYING_GUIDES[0];
  const listGuides = filteredGuides.filter((g) => g.id !== featuredGuide.id);

  return (
    <section id="panduan" className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-800" />
              <span>KATALOG PANDUAN BELANJA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Artikel Rekomendasi Produk Teruji
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Bukan sekadar daftar barang. Kami bedah kelebihan, kekurangan, dan harga riil langsung dalam ulasan artikel santai.
            </p>
          </div>

          {/* Minimalist Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
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

        {/* Featured Guide Spotlight (Headline Article) */}
        {featuredGuide && (
          <div className="mb-10 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8 lg:p-10 hover:border-slate-300 transition-colors">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-orange-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded">
                    PANDUAN UTAMA
                  </span>
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    {featuredGuide.categoryName}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">{featuredGuide.readTime}</span>
                </div>

                <Link href={`/panduan/${featuredGuide.slug}`} className="block group">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors tracking-tight leading-tight">
                    {featuredGuide.title}
                  </h3>
                </Link>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {featuredGuide.subtitle}
                </p>

                {/* Quick items preview */}
                <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500 font-medium">Ulasan unggulan:</span>
                  {featuredGuide.products.slice(0, 3).map((p, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-semibold"
                    >
                      {p.name.split(" ").slice(0, 3).join(" ")}
                    </span>
                  ))}
                </div>

                {/* CTA & Author */}
                <div className="pt-3 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/60">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={featuredGuide.author.avatar}
                      alt={featuredGuide.author.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <span className="text-xs font-medium text-slate-600">
                      Oleh <strong className="text-slate-900">{featuredGuide.author.name}</strong>
                    </span>
                  </div>

                  <Link
                    href={`/panduan/${featuredGuide.slug}`}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold py-2.5 px-5 rounded-xl transition-colors shadow-xs"
                  >
                    <span>Baca Panduan Lengkap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Cover Photo */}
              <div className="lg:col-span-5">
                <Link
                  href={`/panduan/${featuredGuide.slug}`}
                  className="block relative aspect-[16/10] rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm group"
                >
                  <img
                    src={featuredGuide.coverImage}
                    alt={featuredGuide.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                    {featuredGuide.itemCount} Produk Teruji
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Grid of Other Buying Guides */}
        {listGuides.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listGuides.map((guide) => (
              <article
                key={guide.id}
                className="group rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <Link
                    href={`/panduan/${guide.slug}`}
                    className="block relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-100 mb-4"
                  >
                    <img
                      src={guide.coverImage}
                      alt={guide.title}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {guide.categoryName}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">
                      {guide.itemCount} Rekomendasi
                    </span>
                  </Link>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{guide.updatedAt}</span>
                      <span>•</span>
                      <span>{guide.readTime}</span>
                    </div>

                    <Link href={`/panduan/${guide.slug}`} className="block">
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug line-clamp-2">
                        {guide.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {guide.excerpt}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={guide.author.avatar}
                      alt={guide.author.name}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                    <span className="text-[11px] font-medium text-slate-600 truncate max-w-[130px]">
                      {guide.author.name}
                    </span>
                  </div>

                  <Link
                    href={`/panduan/${guide.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Baca Panduan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
