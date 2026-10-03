"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { searchDaeReview, SearchResults } from "@/lib/search";
import { Search, ArrowRight, ExternalLink, BookOpen, Newspaper, Package, Sparkles } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";

  const [queryInput, setQueryInput] = useState(q);
  const [results, setResults] = useState<SearchResults>({
    query: q,
    guides: [],
    products: [],
    news: [],
    totalCount: 0,
  });
  const [activeTab, setActiveTab] = useState<"all" | "guides" | "products" | "news">("all");

  useEffect(() => {
    setQueryInput(q);
    if (q) {
      setResults(searchDaeReview(q));
    } else {
      setResults({
        query: "",
        guides: [],
        products: [],
        news: [],
        totalCount: 0,
      });
    }
  }, [q]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(queryInput.trim())}`);
    }
  };

  const POPULAR_TAGS = [
    "TWS",
    "Mechanical Keyboard",
    "Air Fryer",
    "Robot Vacuum",
    "Smartwatch",
    "Audio",
    "Xiaomi",
    "Baseus"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search Input Bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Cari ulasan produk, keyboard, TWS, air fryer..."
            className="w-full pl-12 pr-28 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white shadow-xs transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Cari
          </button>
        </form>

        {/* Quick Suggestion Tags */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Pencarian Populer:</span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => router.push(`/search?q=${encodeURIComponent(tag)}`)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Query Header & Stats */}
      {q && (
        <div className="border-b border-slate-200 pb-5 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hasil pencarian untuk &ldquo;<span className="text-orange-600">{q}</span>&rdquo;
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Ditemukan <strong className="text-slate-900 font-bold">{results.totalCount}</strong> hasil relevan di seluruh portal ulasan DaeReview.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-5">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Semua ({results.totalCount})
            </button>
            <button
              onClick={() => setActiveTab("guides")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "guides"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Panduan Belanja ({results.guides.length})
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "products"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Produk Teruji ({results.products.length})
            </button>
            <button
              onClick={() => setActiveTab("news")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "news"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Kabar & Tren ({results.news.length})
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {q && results.totalCount === 0 && (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 max-w-xl mx-auto p-8">
          <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900">
            Tidak ada ulasan yang cocok dengan &ldquo;{q}&rdquo;
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
            Coba periksa ejaan kata kunci kamu atau pilih salah satu kategori populer di atas.
          </p>
        </div>
      )}

      {/* Results Container */}
      <div className="space-y-12">
        {/* 1. Buying Guides Section */}
        {(activeTab === "all" || activeTab === "guides") && results.guides.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              <BookOpen className="w-4 h-4 text-slate-800" />
              <span>Panduan Belanja & Artikel Kurasi ({results.guides.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.guides.map((guide) => (
                <article
                  key={guide.id}
                  className="rounded-2xl border border-slate-200 p-5 bg-white hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <Link
                      href={`/panduan/${guide.slug}`}
                      className="block relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-100 mb-3"
                    >
                      <img
                        src={guide.coverImage}
                        alt={guide.title}
                        className="w-full h-full object-cover hover:scale-104 transition-transform duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {guide.categoryName}
                      </span>
                    </Link>

                    <Link href={`/panduan/${guide.slug}`} className="block">
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 hover:text-orange-600 transition-colors leading-snug line-clamp-2">
                        {guide.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {guide.excerpt}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-600">
                    <span className="text-slate-500 font-normal">{guide.readTime}</span>
                    <Link href={`/panduan/${guide.slug}`} className="inline-flex items-center gap-1 hover:underline">
                      <span>Baca Ulasan Lengkap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* 2. Products Section */}
        {(activeTab === "all" || activeTab === "products") && results.products.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Package className="w-4 h-4 text-slate-800" />
              <span>Produk Teruji & Skor Review ({results.products.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.products.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 p-5 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider">
                        {item.badge} • SKOR {item.rating} / 5
                      </div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                        {item.name}
                      </h3>
                      <div className="text-base font-black text-slate-900 mt-1">
                        {item.price}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <a
                      href={item.shopeeUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 bg-[#EE4D2D] hover:bg-[#d83d1e] text-white text-xs font-bold py-2 px-3.5 rounded-lg transition-colors"
                    >
                      <span>Shopee</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={item.tokopediaUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold py-2 px-3.5 rounded-lg transition-colors"
                    >
                      <span>Tokopedia</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. News Section */}
        {(activeTab === "all" || activeTab === "news") && results.news.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Newspaper className="w-4 h-4 text-slate-800" />
              <span>Kabar & Tren Pasar ({results.news.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.news.map((item) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.slug}`}
                  className="rounded-2xl border border-slate-200 p-4 bg-white flex gap-4 hover:border-slate-300 transition-colors group"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-[11px] font-bold text-slate-500 uppercase">
                      {item.category} • {item.date}
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 mt-1">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-orange-100 selection:text-orange-900">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500">Memuat hasil pencarian...</div>}>
          <SearchContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
