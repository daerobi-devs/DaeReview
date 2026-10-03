"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import { searchDaeReview, SearchResults } from "@/lib/search";
import {
  Search,
  Menu,
  X,
  ShieldCheck,
  TrendingUp,
  BookOpen,
  Package,
  Newspaper,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import AffiliateButton from "@/components/AffiliateButton";

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults>({
    query: "",
    guides: [],
    products: [],
    news: [],
    totalCount: 0,
  });

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Update live search results
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      setSearchResults(searchDaeReview(searchQuery));
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  }, [searchQuery]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      setMobileMenuOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectResult = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Logo size="md" />

        {/* Live Search Engine Bar - Desktop */}
        <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-md mx-6 relative">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim().length >= 2) setIsSearchOpen(true);
              }}
              placeholder="Cari review produk, TWS, keyboard, gadget..."
              className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Instant Search Results Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 divide-y divide-slate-100 max-h-[75vh] overflow-y-auto">
              {/* Guides / Roundups */}
              {searchResults.guides.length > 0 && (
                <div className="p-3">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-orange-600" />
                    <span>Panduan Belanja ({searchResults.guides.length})</span>
                  </div>
                  <div className="space-y-1">
                    {searchResults.guides.slice(0, 3).map((guide) => (
                      <Link
                        key={guide.id}
                        href={`/panduan/${guide.slug}`}
                        onClick={handleSelectResult}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <img
                            src={guide.coverImage}
                            alt={guide.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold text-orange-600 uppercase">
                            {guide.categoryName}
                          </div>
                          <div className="text-xs font-bold text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                            {guide.title}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {searchResults.products.length > 0 && (
                <div className="p-3">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-slate-800" />
                    <span>Produk Terverifikasi ({searchResults.products.length})</span>
                  </div>
                  <div className="space-y-1">
                    {searchResults.products.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {item.name}
                            </div>
                            <div className="text-[11px] font-semibold text-slate-500">
                              {item.price} • Skor: {item.rating}
                            </div>
                          </div>
                        </div>
                        <AffiliateButton
                          store="shopee"
                          href={item.shopeeUrl}
                          productName={item.name}
                          productId={item.id}
                          sourcePage="/search-popup"
                          className="shrink-0 bg-[#EE4D2D] hover:bg-[#d83d1e] text-white text-[11px] font-bold px-2.5 py-1 rounded-md cursor-pointer"
                        >
                          Shopee
                        </AffiliateButton>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* News */}
              {searchResults.news.length > 0 && (
                <div className="p-3">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                    <Newspaper className="w-3.5 h-3.5 text-slate-600" />
                    <span>Kabar & Tren ({searchResults.news.length})</span>
                  </div>
                  <div className="space-y-1">
                    {searchResults.news.slice(0, 2).map((item) => (
                      <Link
                        key={item.id}
                        href={`/berita/${item.slug}`}
                        onClick={handleSelectResult}
                        className="block p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {item.category} • {item.readTime}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {searchResults.totalCount === 0 && (
                <div className="p-6 text-center text-xs text-slate-500">
                  Tidak ada ulasan ditemukan untuk &ldquo;{searchQuery}&rdquo;.
                </div>
              )}

              {/* View all button */}
              {searchResults.totalCount > 0 && (
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-900 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Lihat semua {searchResults.totalCount} hasil pencarian</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          <Link href="/#panduan" className="hover:text-slate-950 transition-colors">
            Panduan Belanja & Ulasan
          </Link>
          <Link href="/berita" className="hover:text-slate-950 transition-colors">
            Kabar & Tren
          </Link>
          <Link href="/#perbandingan" className="hover:text-slate-950 transition-colors">
            Tabel Perbandingan
          </Link>
        </nav>


        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu with Working Search */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-3">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari review atau berita produk..."
              className="w-full pl-9 pr-14 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded"
            >
              Cari
            </button>
          </form>

          <div className="flex flex-col space-y-2 text-base font-medium text-slate-700">
            <Link
              href="/#panduan"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Panduan Belanja & Ulasan
            </Link>
            <Link
              href="/berita"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Kabar & Tren
            </Link>
            <Link
              href="/#perbandingan"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Tabel Perbandingan
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
