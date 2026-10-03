"use client";

import React, { useState, useEffect } from "react";
import { MOCK_NEWS, NewsArticle } from "@/data/mockData";
import { getAllArticles, NEWS_UPDATE_EVENT } from "@/lib/dynamicNews";
import { Clock, Calendar, ArrowRight, Flame } from "lucide-react";
import Link from "next/link";

export default function TrendingNews() {
  const [newsList, setNewsList] = useState<NewsArticle[]>(MOCK_NEWS);

  useEffect(() => {
    setNewsList(getAllArticles());

    const handleUpdate = () => {
      setNewsList(getAllArticles());
    };

    window.addEventListener(NEWS_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(NEWS_UPDATE_EVENT, handleUpdate);
  }, []);

  const featuredNews = newsList[0] || MOCK_NEWS[0];
  const sideNews = newsList.slice(1, 5);

  return (
    <section id="berita" className="pt-8 pb-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Editorial Lead Bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <h1 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              KABAR & TREN BELANJA TERKINI
            </h1>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Edisi Hari Ini</span>
          </div>

          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Riset independen berbasis pergerakan e-commerce Indonesia
          </div>
        </div>

        {/* Magazine Cover Layout: 1 Lead Cover Story + 3 Curated Stacked Stories */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Lead Cover Story */}
          <Link
            href={`/berita/${featuredNews.slug}`}
            className="lg:col-span-7 group block"
          >
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={featuredNews.image}
                alt={featuredNews.title}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute top-3.5 left-3.5 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
                LAPORAN KHUSUS
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                <span className="font-bold text-slate-900">{featuredNews.category}</span>
                <span>•</span>
                <span>{featuredNews.date}</span>
                <span>•</span>
                <span>{featuredNews.readTime}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors tracking-tight leading-tight">
                {featuredNews.title}
              </h2>

              <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                {featuredNews.summary}
              </p>

              <div className="pt-1 inline-flex items-center gap-1 text-xs font-bold text-orange-600 group-hover:translate-x-0.5 transition-transform">
                <span>Baca Selengkapnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

          {/* 3 Curated Side Stories */}
          <div className="lg:col-span-5 divide-y divide-slate-100">
            {sideNews.map((item, index) => (
              <Link
                key={item.id}
                href={`/berita/${item.slug}`}
                className={`group flex gap-4 py-4 ${index === 0 ? "pt-0" : ""} hover:bg-slate-50/60 transition-colors rounded-xl px-2 -mx-2 block`}
              >
                <div className="relative w-24 sm:w-28 aspect-square rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-center space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {item.category} • {item.readTime}
                    </span>
                    {item.verdictFactCheck && (
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded tracking-wider ${
                        item.verdictFactCheck === "MITOS"
                          ? "bg-rose-100 text-rose-700"
                          : item.verdictFactCheck === "FAKTA"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {item.verdictFactCheck}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </Link>
            ))}

            <div className="pt-4">
              <Link
                href="/berita"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 hover:text-slate-950 transition-colors"
              >
                <span>Lihat Semua Kabar & Tren Belanja ({MOCK_NEWS.length} Artikel)</span>
                <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
