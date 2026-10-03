import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MOCK_NEWS, MOCK_PRODUCTS } from "@/data/mockData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialShareBar from "@/components/SocialShareBar";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Flame,
} from "lucide-react";
import type { Metadata } from "next";

import fs from "fs";
import path from "path";
import { NewsArticle } from "@/data/mockData";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

function getArticleServer(slug: string): NewsArticle | undefined {
  try {
    const dataFile = path.join(process.cwd(), "src", "data", "custom_news.json");
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, "utf-8");
      const custom: NewsArticle[] = JSON.parse(raw);
      const match = custom.find((item) => item.slug === slug);
      if (match) return match;
    }
  } catch (e) {
    // fallback
  }
  return MOCK_NEWS.find((item) => item.slug === slug);
}

function getOtherArticlesServer(currentId: string): NewsArticle[] {
  try {
    const dataFile = path.join(process.cwd(), "src", "data", "custom_news.json");
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, "utf-8");
      const custom: NewsArticle[] = JSON.parse(raw);
      const combined = [...custom, ...MOCK_NEWS.filter((m) => !custom.some((c) => c.slug === m.slug))];
      return combined.filter((item) => item.id !== currentId).slice(0, 3);
    }
  } catch (e) {
    // fallback
  }
  return MOCK_NEWS.filter((item) => item.id !== currentId).slice(0, 3);
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleServer(slug);

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan — DaeReview",
    };
  }

  const pageUrl = `https://daereview.daeroom.my.id/berita/${article.slug}`;

  return {
    metadataBase: new URL("https://daereview.daeroom.my.id"),
    title: `${article.title} — DaeReview`,
    description: article.summary,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      url: pageUrl,
      siteName: "DaeReview — Panduan Belanja & Ulasan Teruji",
      locale: "id_ID",
      type: "article",
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: [article.image],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleServer(slug);

  if (!article) {
    notFound();
  }

  // Find related product if linked
  const relatedProduct = article.relatedProductId
    ? MOCK_PRODUCTS.find((p) => p.id === article.relatedProductId)
    : null;

  // Other news recommendations
  const otherNews = getOtherArticlesServer(article.id);
  const articleUrl = `https://daereview.daeroom.my.id/berita/${article.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    image: [article.image],
    datePublished: "2026-10-01T08:00:00+07:00",
    dateModified: "2026-10-03T08:00:00+07:00",
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "DaeReview",
      url: "https://daereview.daeroom.my.id",
      logo: {
        "@type": "ImageObject",
        url: "https://daereview.daeroom.my.id/icon.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-orange-100 selection:text-orange-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-1 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-xs text-slate-500 mb-6 font-medium">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/berita" className="hover:text-slate-900 transition-colors">
              Kabar & Tren
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold truncate max-w-xs">{article.category}</span>
          </nav>

          {/* Article Header */}
          <header className="space-y-4 pb-8 border-b border-slate-200">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
              <span>{article.category}</span>
              {article.isTrending && (
                <>
                  <span>•</span>
                  <span className="text-orange-600">TRENDING</span>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {article.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {article.summary}
            </p>

            {/* Author and Metadata Bar with Social Share */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                  <User className="w-3.5 h-3.5 text-slate-400" /> {article.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {article.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {article.readTime}
                </span>
              </div>

              {/* Social Share Toolbar */}
              <SocialShareBar
                title={article.title}
                url={articleUrl}
                category={article.category}
              />
            </div>
          </header>

          {/* Main Hero Image */}
          <div className="my-8 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 aspect-[16/9] shadow-xs">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Fact-Check Callout Box (if applicable) */}
          {article.verdictFactCheck && article.quickTakeaway && (
            <div
              className={`my-8 p-6 rounded-2xl border ${
                article.verdictFactCheck === "MITOS"
                  ? "bg-rose-50/70 border-rose-200 text-slate-900"
                  : article.verdictFactCheck === "FAKTA"
                  ? "bg-emerald-50/70 border-emerald-200 text-slate-900"
                  : "bg-amber-50/70 border-amber-200 text-slate-900"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span
                  className={`text-xs font-black uppercase px-3 py-1 rounded-md tracking-wider text-white shadow-xs ${
                    article.verdictFactCheck === "MITOS"
                      ? "bg-rose-600"
                      : article.verdictFactCheck === "FAKTA"
                      ? "bg-emerald-600"
                      : "bg-amber-600"
                  }`}
                >
                  VONIS REDAKSI: {article.verdictFactCheck}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Uji Verifikasi Teknis & Data Empiris
                </span>
              </div>
              <p className="text-sm sm:text-base font-semibold leading-relaxed">
                {article.quickTakeaway}
              </p>
            </div>
          )}

          {/* Article Content Paragraphs */}
          <article className="prose prose-slate max-w-none text-slate-700 space-y-6 text-base sm:text-lg leading-relaxed font-normal">
            {article.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </article>

          {/* Subtle Bottom Share Bar */}
          <div className="my-8 pt-6 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Bagikan artikel:
            </span>
            <SocialShareBar
              title={article.title}
              url={articleUrl}
              category={article.category}
            />
          </div>

          {/* THE KILLER AFFILIATE BRIDGE WIDGET: Related Product Callout */}
          {relatedProduct && (
            <div className="my-12 p-6 sm:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> REKOMENDASI TERKAIT BERITA INI
                </div>
                <span className="text-xs bg-slate-900 text-white font-bold px-2.5 py-0.5 rounded-full">
                  PILIHAN EDITOR
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-4 aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="sm:col-span-8 space-y-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {relatedProduct.verdict}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <div>
                      <span className="text-xs text-slate-500 block">Harga Pasaran:</span>
                      <span className="text-xl font-black text-slate-900">{relatedProduct.price}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={relatedProduct.shopeeUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center gap-1.5 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors"
                      >
                        <span>Cek di Shopee</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={relatedProduct.tokopediaUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors"
                      >
                        <span>Tokopedia</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>

                      {relatedProduct.tiktokUrl && (
                        <a
                          href={relatedProduct.tiktokUrl}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          <span>TikTok Shop</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Back Button */}
          <div className="pt-8 pb-12 border-t border-slate-200 flex items-center justify-between">
            <Link
              href="/berita"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Semua Kabar & Tren</span>
            </Link>
          </div>

          {/* Read Next Section */}
          <div className="pt-8 border-t border-slate-100">
            <h3 className="text-xl font-extrabold text-slate-900 mb-6">
              Kabar & Tren Lainnya yang Perlu Kamu Tahu
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {otherNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.slug}`}
                  className="group block space-y-2.5"
                >
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase">
                    {item.category} • {item.readTime}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
