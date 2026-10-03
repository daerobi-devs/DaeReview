"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MOCK_NEWS, NewsArticle } from "@/data/mockData";
import { getAllArticles, NEWS_UPDATE_EVENT } from "@/lib/dynamicNews";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Clock, Calendar, ArrowRight, ChevronRight, Newspaper, Flame, Filter } from "lucide-react";

export default function BeritaHubPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [articles, setArticles] = useState<NewsArticle[]>(MOCK_NEWS);

  useEffect(() => {
    // Load local dynamic articles on mount
    setArticles(getAllArticles());

    const handleNewsUpdate = () => {
      setArticles(getAllArticles());
    };

    window.addEventListener(NEWS_UPDATE_EVENT, handleNewsUpdate);
    return () => window.removeEventListener(NEWS_UPDATE_EVENT, handleNewsUpdate);
  }, []);

  const categories = [
    "Semua",
    "Fakta vs Mitos",
    "Teknologi & AI",
    "Gadget",
    "Tren Belanja",
    "Smart Home",
    "Tips Hemat"
  ];

  const filteredNews =
    selectedCategory === "Semua"
      ? articles
      : articles.filter((item) => item.category === selectedCategory);

  const headlineNews = filteredNews[0] || articles[0] || MOCK_NEWS[0];
  const otherNews = filteredNews.filter((item) => item.id !== headlineNews.id);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-orange-100 selection:text-orange-900">
      <Header />

      <main className="flex-1 pb-20">
        {/* Breadcrumb Navigation */}
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
            <nav className="flex items-center space-x-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-slate-900 transition-colors">
                Beranda
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-bold">Kabar & Tren</span>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <Newspaper className="w-4 h-4 text-slate-900" />
                <span>EDITORIAL & INTEL BELANJA</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                Kabar & Tren Belanja Terkini
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                Riset independen, analisis pergerakan harga e-commerce, tips menghindari flash sale palsu, dan bocoran teknologi terbaru di Indonesia.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          {/* Featured Headline Story */}
          {headlineNews && (
            <div className="mb-12">
              <Link
                href={`/berita/${headlineNews.slug}`}
                className="group block rounded-2xl border border-slate-200 p-6 sm:p-8 bg-slate-50/70 hover:border-slate-300 transition-colors"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                        LAPORAN UTAMA
                      </span>
                      <span className="text-xs font-bold text-orange-600 uppercase">
                        {headlineNews.category}
                      </span>
                      {headlineNews.verdictFactCheck && (
                        <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded tracking-wide ${
                          headlineNews.verdictFactCheck === "MITOS"
                            ? "bg-rose-100 text-rose-700 border border-rose-200"
                            : headlineNews.verdictFactCheck === "FAKTA"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-amber-100 text-amber-700 border border-amber-200"
                        }`}>
                          VONIS: {headlineNews.verdictFactCheck}
                        </span>
                      )}
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">{headlineNews.readTime}</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors tracking-tight leading-tight">
                      {headlineNews.title}
                    </h2>

                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                      {headlineNews.summary}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 text-xs text-slate-500">
                      <div>
                        Oleh <strong className="text-slate-900">{headlineNews.author}</strong> • {headlineNews.date}
                      </div>
                      <div className="inline-flex items-center gap-1 font-bold text-orange-600 group-hover:translate-x-0.5 transition-transform">
                        <span>Baca Selengkapnya</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                      <img
                        src={headlineNews.image}
                        alt={headlineNews.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Grid of Other Articles */}
          {otherNews.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">
                ARTIKEL TERBARU LAINNYA:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherNews.map((item) => (
                  <article
                    key={item.id}
                    className="group rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all p-5 flex flex-col justify-between"
                  >
                    <div>
                      <Link
                        href={`/berita/${item.slug}`}
                        className="block relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-100 mb-4"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                        />
                        <span className="absolute top-2.5 left-2.5 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          {item.category}
                        </span>
                        {item.verdictFactCheck && (
                          <span className={`absolute top-2.5 right-2.5 text-[10px] font-black px-2 py-0.5 rounded uppercase shadow-xs ${
                            item.verdictFactCheck === "MITOS"
                              ? "bg-rose-600 text-white"
                              : item.verdictFactCheck === "FAKTA"
                              ? "bg-emerald-600 text-white"
                              : "bg-amber-600 text-white"
                          }`}>
                            {item.verdictFactCheck}
                          </span>
                        )}
                      </Link>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span>{item.date}</span>
                          <span>•</span>
                          <span>{item.readTime}</span>
                        </div>

                        <Link href={`/berita/${item.slug}`} className="block">
                          <h3 className="font-extrabold text-base text-slate-900 group-hover:text-orange-600 transition-colors leading-snug line-clamp-2">
                            {item.title}
                          </h3>
                        </Link>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        Oleh <strong className="text-slate-800">{item.author}</strong>
                      </span>
                      <Link
                        href={`/berita/${item.slug}`}
                        className="inline-flex items-center gap-1 font-bold text-orange-600 group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Baca</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
