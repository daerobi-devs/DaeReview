import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ShieldCheck,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Share2,
  HelpCircle,
  Award
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialShareBar from "@/components/SocialShareBar";
import { BUYING_GUIDES, BuyingGuide } from "@/data/mockData";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { supabaseAdmin } from "@/lib/supabase";
import AffiliateButton from "@/components/AffiliateButton";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getGuideServer(slug: string): Promise<BuyingGuide | undefined> {
  // 1. Cek dari file storage persisten server
  try {
    const dataFile = path.join(process.cwd(), "src", "data", "custom_guides.json");
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, "utf-8");
      const custom: BuyingGuide[] = JSON.parse(raw);
      const match = custom.find((g) => g.slug === slug);
      if (match) return match;
    }
  } catch (e) {
    // fallback
  }

  // 2. Cek dari Supabase Database (public.guides)
  try {
    const { data, error } = await supabaseAdmin
      .from("guides")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        subtitle: data.subtitle || "",
        category: data.category || "gadget",
        categoryName: data.category_name || "Gadget & Setup",
        updatedAt: data.updated_at
          ? new Intl.DateTimeFormat("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(data.updated_at))
          : "Terbaru",
        readTime: data.read_time || "6 menit",
        author: data.author || {
          name: "Tim Redaksi DaeReview",
          role: "Lead Hardware & Gadget Editor",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        },
        coverImage:
          data.cover_image ||
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
        excerpt: data.excerpt || data.subtitle || "",
        isFeatured: Boolean(data.is_featured),
        itemCount:
          Number(data.item_count) ||
          (Array.isArray(data.products) ? data.products.length : 0),
        intro: Array.isArray(data.intro) ? data.intro : [data.subtitle || ""],
        quickPicks: Array.isArray(data.quick_picks) ? data.quick_picks : [],
        products: Array.isArray(data.products) ? data.products : [],
        buyingAdvice: Array.isArray(data.buying_advice) ? data.buying_advice : [],
        faqs: Array.isArray(data.faqs) ? data.faqs : [],
      };
    }
  } catch (dbErr) {
    // fallback
  }

  return BUYING_GUIDES.find((g) => g.slug === slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideServer(slug);

  if (!guide) {
    return {
      title: "Panduan Belanja Tidak Ditemukan — DaeReview",
    };
  }

  const pageUrl = `https://daereview.daeroom.my.id/panduan/${guide.slug}`;

  return {
    metadataBase: new URL("https://daereview.daeroom.my.id"),
    applicationName: "DaeReview",
    title: `${guide.title} — DaeReview`,
    description: guide.subtitle,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: guide.title,
      description: guide.subtitle,
      url: pageUrl,
      siteName: "DaeReview",
      locale: "id_ID",
      type: "article",
      images: [
        {
          url: guide.coverImage,
          width: 1200,
          height: 630,
          alt: guide.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.subtitle,
      images: [guide.coverImage],
    },
  };
}

export default async function BuyingGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = await getGuideServer(slug);

  if (!guide) {
    notFound();
  }

  // Related guides
  const relatedGuides = BUYING_GUIDES.filter((g) => g.id !== guide.id).slice(0, 3);
  const guideUrl = `https://daereview.daeroom.my.id/panduan/${guide.slug}`;

  // Structured Data Schema (JSON-LD) for Google Rich Snippets
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: guide.title,
      description: guide.subtitle,
      numberOfItems: guide.products.length,
      itemListElement: guide.products.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "Product",
          name: item.name,
          description: item.tagline,
          image: item.image,
          offers: {
            "@type": "Offer",
            priceCurrency: "IDR",
            price: item.price.replace(/[^0-9]/g, ""),
            availability: "https://schema.org/InStock",
          },
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Beranda",
          item: "https://daereview.daeroom.my.id",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: guide.categoryName,
          item: "https://daereview.daeroom.my.id/#kategori",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: guide.title,
          item: guideUrl,
        },
      ],
    },
    ...(guide.faqs && guide.faqs.length > 0
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: guide.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-orange-100 selection:text-orange-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-1 pb-20">
        {/* Breadcrumb Navigation */}
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5">
            <nav className="flex items-center space-x-2 text-xs text-slate-500 overflow-x-auto">
              <Link href="/" className="hover:text-slate-900 transition-colors shrink-0">
                Beranda
              </Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <Link
                href={`/#kategori`}
                className="hover:text-slate-900 transition-colors shrink-0 font-medium text-slate-700"
              >
                {guide.categoryName}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span className="text-slate-900 font-bold truncate max-w-xs sm:max-w-md">
                {guide.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Editorial Article Header */}
        <header className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md">
                {guide.categoryName}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              {guide.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {guide.subtitle}
            </p>

            {/* Author & Meta Line */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={guide.author.avatar}
                  alt={guide.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">{guide.author.name}</div>
                  <div className="text-[11px] text-slate-500">{guide.author.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Diperbarui {guide.updatedAt}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{guide.readTime}</span>
                </div>
              </div>

              {/* Social Share Bar */}
              <div className="w-full pt-2 sm:w-auto sm:pt-0">
                <SocialShareBar
                  title={guide.title}
                  url={guideUrl}
                  category={guide.categoryName}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12">
          <div className="aspect-[21/9] sm:aspect-[16/7] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
            <img
              src={guide.coverImage}
              alt={guide.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Article Content Layout */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="space-y-12">
            {/* Quick Picks Box (ProductNation Signature: Ringkasan Cepat) */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-orange-600" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Pilihan Cepat Kami (Quick Picks)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mb-6">
                Tidak punya waktu membaca seluruh panduan? Berikut 3 pemenang mutlak hasil kurasi tim kami:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {guide.quickPicks.map((pick, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 mb-2">
                        {pick.badge}
                      </div>
                      <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 mb-3 border border-slate-100">
                        <img
                          src={pick.image}
                          alt={pick.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-snug line-clamp-2">
                        {pick.name}
                      </h3>
                      <div className="mt-2 text-base font-black text-slate-900">
                        {pick.price}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                      {pick.shopeeUrl?.trim() && (
                        <AffiliateButton
                          store="shopee"
                          href={pick.shopeeUrl}
                          productName={pick.name}
                          sourcePage={`/panduan/${guide.slug}`}
                          className="flex-1 text-center bg-[#EE4D2D] hover:bg-[#d83d1e] text-white text-xs font-bold py-2 px-2.5 rounded-lg transition-colors min-w-[70px]"
                        >
                          Shopee
                        </AffiliateButton>
                      )}
                      {pick.tokopediaUrl?.trim() && (
                        <AffiliateButton
                          store="tokopedia"
                          href={pick.tokopediaUrl}
                          productName={pick.name}
                          sourcePage={`/panduan/${guide.slug}`}
                          className="flex-1 text-center bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold py-2 px-2.5 rounded-lg transition-colors min-w-[70px]"
                        >
                          Tokopedia
                        </AffiliateButton>
                      )}
                      {pick.tiktokUrl?.trim() && (
                        <AffiliateButton
                          store="tiktok"
                          href={pick.tiktokUrl}
                          productName={pick.name}
                          sourcePage={`/panduan/${guide.slug}`}
                          className="flex-1 text-center bg-slate-900 hover:bg-black text-white text-xs font-semibold py-2 px-2.5 rounded-lg transition-colors min-w-[70px]"
                        >
                          TikTok
                        </AffiliateButton>
                      )}
                      {!pick.shopeeUrl?.trim() && !pick.tokopediaUrl?.trim() && !pick.tiktokUrl?.trim() && (
                        <AffiliateButton
                          store="shopee"
                          productName={pick.name}
                          sourcePage={`/panduan/${guide.slug}`}
                          className="flex-1 text-center bg-[#EE4D2D] hover:bg-[#d83d1e] text-white text-xs font-bold py-2 rounded-lg transition-colors"
                        >
                          Cek Toko
                        </AffiliateButton>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editorial Intro */}
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 text-base sm:text-lg">
              {guide.intro.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Table of Contents */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> DAFTAR PRODUK YANG DIULAS:
              </div>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {guide.products.map((prod) => (
                  <li key={prod.rank}>
                    <a
                      href={`#produk-${prod.rank}`}
                      className="text-slate-700 hover:text-orange-600 font-medium transition-colors flex items-center gap-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-900 text-xs font-bold flex items-center justify-center shrink-0">
                        {prod.rank}
                      </span>
                      <span className="truncate">{prod.name}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {/* Individual Product Deep Dives (Article Style) */}
            <div className="space-y-14 pt-4">
              {guide.products.map((item) => (
                <article
                  key={item.rank}
                  id={`produk-${item.rank}`}
                  className="scroll-mt-24 rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white"
                >
                  {/* Product Title Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shrink-0">
                        #{item.rank}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[11px] font-extrabold text-orange-600 uppercase tracking-wider">
                            {item.badge}
                          </span>
                          {item.verifiedOfficial && (
                            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                              • <ShieldCheck className="w-3 h-3 text-emerald-600" /> Toko Resmi Terverifikasi
                            </span>
                          )}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                          {item.name}
                        </h2>
                      </div>
                    </div>

                    <div className="flex sm:flex-col sm:items-end justify-between items-center shrink-0">
                      <div className="text-2xl font-black text-slate-900">
                        {item.price}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        Skor: <span className="font-bold text-slate-900">{item.rating} / 5</span> ({item.reviewCount.toLocaleString("id-ID")} ulasan riil)
                      </div>
                    </div>
                  </div>

                  {/* Body: Image + Editorial Review */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-start">
                    {/* Photo */}
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

                    {/* Editorial Text */}
                    <div className="lg:col-span-8 space-y-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {item.tagline}
                      </p>

                      <p className="text-sm text-slate-700 leading-relaxed">
                        {item.verdict}
                      </p>

                      {/* Clean Pros and Cons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {/* Kelebihan */}
                        <div className="space-y-1.5">
                          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                            <span>Kelebihan</span>
                          </div>
                          <ul className="space-y-1 text-xs text-slate-600">
                            {item.pros.map((pro, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-emerald-600 font-bold">•</span>
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Kekurangan */}
                        <div className="space-y-1.5">
                          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                            <X className="w-3.5 h-3.5 text-rose-500 stroke-[3]" />
                            <span>Kekurangan</span>
                          </div>
                          <ul className="space-y-1 text-xs text-slate-600">
                            {item.cons.map((con, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-rose-500 font-bold">•</span>
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Specs */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">Spesifikasi Kunci:</span>
                        {Object.entries(item.specs).map(([key, val]) => (
                          <span key={key}>
                            {key}: <strong className="text-slate-800">{val}</strong>
                          </span>
                        ))}
                      </div>

                      {/* Action CTA Buttons — dynamically adapts to provided stores */}
                      <div className="pt-3 flex flex-wrap items-center gap-3">
                        {item.shopeeUrl?.trim() && (
                          <AffiliateButton
                            store="shopee"
                            href={item.shopeeUrl}
                            productName={item.name}
                            sourcePage={`/panduan/${guide.slug}`}
                            className="inline-flex items-center gap-2 bg-[#EE4D2D] hover:bg-[#d83d1e] text-white text-xs sm:text-sm font-bold py-2.5 px-5 rounded-lg transition-colors shadow-2xs"
                          >
                            <span>Cek Harga di Shopee</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </AffiliateButton>
                        )}

                        {item.tokopediaUrl?.trim() && (
                          <AffiliateButton
                            store="tokopedia"
                            href={item.tokopediaUrl}
                            productName={item.name}
                            sourcePage={`/panduan/${guide.slug}`}
                            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs sm:text-sm font-semibold py-2.5 px-5 rounded-lg transition-colors"
                          >
                            <span>Tokopedia</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                          </AffiliateButton>
                        )}

                        {item.tiktokUrl?.trim() && (
                          <AffiliateButton
                            store="tiktok"
                            href={item.tiktokUrl}
                            productName={item.name}
                            sourcePage={`/panduan/${guide.slug}`}
                            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-semibold py-2.5 px-5 rounded-lg transition-colors shadow-2xs"
                          >
                            <span className="w-2 h-2 rounded-full bg-cyan-400" />
                            <span>TikTok Shop</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                          </AffiliateButton>
                        )}

                        {!item.shopeeUrl?.trim() && !item.tokopediaUrl?.trim() && !item.tiktokUrl?.trim() && (
                          <AffiliateButton
                            store="shopee"
                            productName={item.name}
                            sourcePage={`/panduan/${guide.slug}`}
                            className="inline-flex items-center gap-2 bg-[#EE4D2D] hover:bg-[#d83d1e] text-white text-xs sm:text-sm font-bold py-2.5 px-5 rounded-lg transition-colors shadow-2xs"
                          >
                            <span>Cek Harga di Marketplace</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </AffiliateButton>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Buying Advice Section (Panduan Memilih) */}
            {guide.buyingAdvice && guide.buyingAdvice.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-slate-900" />
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Panduan Memilih Sebelum Membeli
                  </h2>
                </div>
                <div className="space-y-4">
                  {guide.buyingAdvice.map((advice, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1.5">
                        {idx + 1}. {advice.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {advice.content}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ Section */}
            {guide.faqs && guide.faqs.length > 0 && (
              <section className="space-y-4 pt-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-slate-900" />
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Pertanyaan yang Sering Diajukan (FAQ)
                  </h2>
                </div>
                <div className="divide-y divide-slate-200 border-y border-slate-200">
                  {guide.faqs.map((faq, idx) => (
                    <div key={idx} className="py-4">
                      <h3 className="font-bold text-sm text-slate-900 mb-1">
                        {faq.q}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related Buying Guides */}
            <div className="pt-10 border-t border-slate-200">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-6">
                Panduan Belanja Terkait Lainnya
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedGuides.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/panduan/${rel.slug}`}
                    className="group block rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-colors bg-white"
                  >
                    <div className="aspect-[16/10] rounded-lg overflow-hidden bg-slate-100 mb-3">
                      <img
                        src={rel.coverImage}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                    </div>
                    <div className="text-[11px] font-bold text-orange-600 uppercase mb-1">
                      {rel.categoryName}
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                      {rel.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
