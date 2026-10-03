import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MOCK_NEWS, MOCK_PRODUCTS, NewsArticle, Product } from "@/data/mockData";
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
import { supabaseAdmin } from "@/lib/supabase";
import AffiliateButton from "@/components/AffiliateButton";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

async function getArticleServer(slug: string): Promise<NewsArticle | undefined> {
  // 1. Cek dari file storage persisten server
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

  // 2. Cek dari Supabase Database (public.articles)
  try {
    const { data, error } = await supabaseAdmin
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        category: data.category,
        summary: data.summary,
        content: Array.isArray(data.content) ? data.content : [data.summary],
        image: data.image,
        author: data.author || "Tim Riset DaeReview",
        readTime: data.read_time || "4 menit",
        date: data.published_at
          ? new Intl.DateTimeFormat("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(data.published_at))
          : new Intl.DateTimeFormat("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date()),
        isTrending: Boolean(data.is_trending),
        isFactCheck: Boolean(data.is_fact_check),
        verdictFactCheck: data.verdict_fact_check || undefined,
        quickTakeaway: data.quick_takeaway || undefined,
        relatedProductId: data.related_product_id || undefined,
        tiktokUrl: data.tiktok_url || undefined,
        isCustom: true,
        status: data.status || "published",
        sources: data.sources || undefined,
        sourceUrl: data.source_url || undefined,
      };
    }
  } catch (dbErr) {
    // fallback
  }

  return MOCK_NEWS.find((item) => item.slug === slug);
}

type ContentBlock =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "h4"; text: string }
  | { type: "quote"; text: string; isTip: boolean }
  | { type: "table"; headerCols: string[]; dataRows: string[][] }
  | { type: "list"; items: string[] }
  | { type: "paragraph"; text: string };

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/**
 * Chip sitasi inline ala Perplexity: logo (favicon) situs rujukan + nama media,
 * menyelinap langsung di dalam kalimat, bukan blok terpisah.
 */
function citationChip(label: string, url: string): string {
  const domain = getDomain(url);
  const safeUrl = escapeAttr(url);
  const shortLabel = (label || domain).replace(/^https?:\/\//, "").slice(0, 28);
  const favicon = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
  return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer nofollow" title="${escapeAttr(label || domain)} — ${escapeAttr(domain)}" class="not-prose inline-flex items-center gap-1 align-middle mx-0.5 pl-1 pr-2 py-0.5 rounded-full bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-[11px] sm:text-xs font-semibold text-slate-600 hover:text-blue-700 no-underline leading-none transition-colors whitespace-nowrap"><img src="${favicon}" alt="" width="14" height="14" loading="lazy" class="w-3.5 h-3.5 rounded-full bg-white shrink-0" />${escapeAttr(shortLabel)}</a>`;
}

function formatInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
    .replace(/__([^_]+)__/g, '<strong class="font-bold text-slate-900">$1</strong>')
    .replace(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g, (_m, label: string, url: string) => citationChip(label, url))
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-700 underline font-semibold hover:text-blue-900">$1</a>')
    .replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<em class="italic text-slate-800">$2</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-sm font-mono">$1</code>');
}

const SOURCE_HEADING_RE = /^(sumber|rujukan|referensi)(\s*(&|dan)\s*(rujukan|referensi|sumber))?(\s+berita)?\s*:?$/i;

/**
 * Selipkan sumber yang belum disitasi ke paragraf yang menyebut nama medianya
 * (atau ke paragraf pembuka) sebagai chip inline.
 */
function injectInlineSources(blocks: ContentBlock[], sources: { name?: string; url: string }[]): ContentBlock[] {
  const fullText = blocks.map((b) => ("text" in b ? b.text : "items" in b ? b.items.join(" ") : "")).join(" ");
  const pending = sources.filter((s) => s?.url && !fullText.includes(s.url));
  if (pending.length === 0) return blocks;

  const result = blocks.map((b) => ({ ...b })) as ContentBlock[];
  const paragraphIdx = result.map((b, i) => (b.type === "paragraph" ? i : -1)).filter((i) => i >= 0);
  if (paragraphIdx.length === 0) return blocks;

  for (const src of pending) {
    const name = (src.name || getDomain(src.url)).trim();
    const keyword = name.split(/\s+/)[0]?.toLowerCase() || "";
    let target = paragraphIdx.find((i) => {
      const t = (result[i] as { text: string }).text.toLowerCase();
      return keyword.length > 2 && t.includes(keyword);
    });
    if (target === undefined) target = paragraphIdx[0];
    const block = result[target] as { type: "paragraph"; text: string };
    block.text = `${block.text} [${name}](${src.url})`;
  }
  return result;
}

function parseArticleContent(
  content: string[] | string,
  extractedSources: { name?: string; url: string }[] = []
): ContentBlock[] {
  const fullText = Array.isArray(content) ? content.join("\n\n") : (content || "");
  const lines = fullText.split(/\r?\n/).map((l) => l.trimEnd());

  const blocks: ContentBlock[] = [];
  let currentList: string[] = [];
  let currentTable: string[] = [];
  let inSourceSection = false;

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push({ type: "list", items: [...currentList] });
      currentList = [];
    }
  };

  const flushTable = () => {
    if (currentTable.length > 0) {
      const validRows = currentTable
        .map((r) => r.trim())
        .filter((r) => r.startsWith("|") && !r.includes("---"));
      if (validRows.length > 0) {
        const headerCols = validRows[0]
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean);
        const dataRows = validRows
          .slice(1)
          .map((r) => r.split("|").map((c) => c.trim()).filter(Boolean));
        if (headerCols.length > 0) {
          blocks.push({ type: "table", headerCols, dataRows });
        }
      }
      currentTable = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      flushTable();
      continue;
    }

    // 0. Seksi "Sumber & Rujukan Berita" tidak dirender sebagai blok —
    //    link-nya dikumpulkan lalu diselipkan inline di paragraf.
    const headingMatch = trimmed.match(/^#{1,4}\s+(.*)$/);
    const headingText = headingMatch ? headingMatch[1].replace(/\*\*/g, "").trim() : "";
    if (headingMatch) {
      inSourceSection = SOURCE_HEADING_RE.test(headingText);
      if (inSourceSection) {
        flushList();
        flushTable();
        continue;
      }
    } else if (!inSourceSection && SOURCE_HEADING_RE.test(trimmed.replace(/\*\*/g, "").trim())) {
      inSourceSection = true;
      flushList();
      flushTable();
      continue;
    }
    if (inSourceSection) {
      const linkRe = /\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g;
      let m: RegExpExecArray | null;
      let found = false;
      while ((m = linkRe.exec(trimmed)) !== null) {
        extractedSources.push({ name: m[1], url: m[2] });
        found = true;
      }
      if (!found) {
        const bare = trimmed.match(/https?:\/\/[^\s)]+/);
        if (bare) extractedSources.push({ url: bare[0] });
      }
      continue;
    }

    // 1. Table row
    if (trimmed.startsWith("|") && trimmed.includes("|", 1)) {
      flushList();
      currentTable.push(trimmed);
      continue;
    } else {
      flushTable();
    }

    // 2. Unordered List Item
    if (/^[-*]\s+/.test(trimmed)) {
      currentList.push(trimmed.replace(/^[-*]\s+/, ""));
      continue;
    } else {
      flushList();
    }

    // 3. Headings
    if (trimmed.startsWith("#### ")) {
      blocks.push({ type: "h4", text: trimmed.slice(5).trim() });
      continue;
    }
    if (trimmed.startsWith("### ")) {
      blocks.push({ type: "h3", text: trimmed.slice(4).trim() });
      continue;
    }
    if (trimmed.startsWith("## ")) {
      blocks.push({ type: "h2", text: trimmed.slice(3).trim() });
      continue;
    }
    if (trimmed.startsWith("# ")) {
      blocks.push({ type: "h1", text: trimmed.slice(2).trim() });
      continue;
    }

    // 4. Blockquote / Tip Callout
    if (trimmed.startsWith(">")) {
      const quoteText = trimmed.replace(/^>\s*/, "");
      const isTip = quoteText.includes("💡") || /inside tip/i.test(quoteText) || /tips redaksi/i.test(quoteText);
      blocks.push({ type: "quote", text: quoteText, isTip });
      continue;
    }

    // 5. Standard Paragraph
    blocks.push({ type: "paragraph", text: trimmed });
  }

  flushList();
  flushTable();

  return blocks;
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

async function getProductServer(id: string): Promise<Product | undefined> {
  // 1. Cek file storage persisten server
  try {
    const prodFile = path.join(process.cwd(), "src", "data", "custom_products.json");
    if (fs.existsSync(prodFile)) {
      const raw = fs.readFileSync(prodFile, "utf-8");
      const custom: Product[] = JSON.parse(raw);
      const match = custom.find((p) => p.id === id);
      if (match) return match;
    }
  } catch (e) {
    // fallback
  }

  // 2. Cek Supabase Database (public.products)
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        rank: data.rank || 1,
        badge: data.badge || "PILIHAN UTAMA",
        name: data.name,
        tagline: data.tagline,
        category: data.category,
        rating: Number(data.rating) || 4.8,
        reviewCount: data.review_count || 100,
        price: data.price,
        originalPrice: data.original_price || undefined,
        discount: data.discount || undefined,
        image: data.image,
        pros: Array.isArray(data.pros) ? data.pros : ["Material kokoh dan awet"],
        cons: Array.isArray(data.cons) ? data.cons : ["Stok promo terbatas"],
        specs: typeof data.specs === "object" && data.specs !== null ? data.specs : { Garansi: "1 Tahun Resmi" },
        shopeeUrl: data.shopee_url || "",
        tokopediaUrl: data.tokopedia_url || "",
        tiktokUrl: data.tiktok_url || "",
        verifiedOfficial: data.verified_official ?? true,
        verdict: data.verdict || "Produk teruji dengan rasio nilai-ke-harga tinggi.",
        isCustom: true,
      };
    }
  } catch (dbErr) {
    // fallback
  }

  // 3. Fallback ke MOCK_PRODUCTS
  return MOCK_PRODUCTS.find((p) => p.id === id);
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleServer(slug);

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan — DaeReview",
    };
  }

  const pageUrl = `https://daereview.daeroom.my.id/berita/${article.slug}`;

  return {
    metadataBase: new URL("https://daereview.daeroom.my.id"),
    applicationName: "DaeReview",
    title: `${article.title} — DaeReview`,
    description: article.summary,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      url: pageUrl,
      siteName: "DaeReview",
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
  const article = await getArticleServer(slug);

  if (!article) {
    notFound();
  }

  // Parse konten + selipkan sumber rujukan sebagai chip inline di dalam paragraf
  const sectionSources: { name?: string; url: string }[] = [];
  const parsedBlocks = parseArticleContent(article.content, sectionSources);
  const allSources = [
    ...(article.sources || []),
    ...sectionSources,
    ...(article.sourceUrl ? [{ name: "", url: article.sourceUrl }] : []),
  ].filter((s, i, arr) => s?.url && arr.findIndex((x) => x.url === s.url) === i);
  const contentBlocks = injectInlineSources(parsedBlocks, allSources);

  // Find related product if linked (supports custom & Supabase products)
  const relatedProduct = article.relatedProductId
    ? await getProductServer(article.relatedProductId)
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

      {article.status === "draft" && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-3 text-amber-900 flex items-center justify-between text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span>
              <strong>MODE PRATINJAU DRAF:</strong> Artikel ini berstatus DRAFT dan belum tayang di halaman publik. Anda dapat menyetujuinya lewat Bot Telegram atau Admin.
            </span>
          </div>
        </div>
      )}

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

          {/* Article Content Blocks */}
          <article className="prose prose-slate max-w-none text-slate-700 space-y-6 text-base sm:text-lg leading-relaxed font-normal">
            {contentBlocks.map((block, index) => {
              if (block.type === "h1") {
                return (
                  <h2
                    key={index}
                    className="text-2xl sm:text-3xl font-black text-slate-950 mt-10 mb-4 tracking-tight border-b-2 border-slate-900/10 pb-3"
                  >
                    {block.text}
                  </h2>
                );
              }

              if (block.type === "h2") {
                return (
                  <h2
                    key={index}
                    className="text-xl sm:text-2xl font-black text-slate-900 mt-8 mb-3 tracking-tight border-b border-slate-200/80 pb-2"
                  >
                    {block.text}
                  </h2>
                );
              }

              if (block.type === "h3") {
                return (
                  <h3
                    key={index}
                    className="text-lg sm:text-xl font-bold text-slate-900 mt-6 mb-2 tracking-tight"
                  >
                    {block.text}
                  </h3>
                );
              }

              if (block.type === "h4") {
                return (
                  <h4
                    key={index}
                    className="text-base sm:text-lg font-bold text-slate-900 mt-5 mb-2"
                  >
                    {block.text}
                  </h4>
                );
              }

              if (block.type === "quote") {
                if (block.isTip) {
                  return (
                    <div
                      key={index}
                      className="p-4 sm:p-5 my-6 bg-amber-50/80 border-l-4 border-amber-500 rounded-r-2xl text-slate-900 text-sm sm:text-base leading-relaxed font-medium shadow-xs space-y-1.5"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-800 uppercase tracking-wider">
                        <span>💡 INSIDE TIP REDAKSI</span>
                      </div>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatInlineMarkdown(
                            block.text
                              .replace(/^💡\s*/, "")
                              .replace(/^\*\*DaeReview Inside Tip:\*\*\s*/i, "")
                          ),
                        }}
                      />
                    </div>
                  );
                }
                return (
                  <blockquote
                    key={index}
                    className="p-4 my-5 bg-slate-50 border-l-4 border-slate-400 rounded-r-2xl text-slate-800 text-sm sm:text-base italic leading-relaxed shadow-2xs"
                    dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(block.text) }}
                  />
                );
              }

              if (block.type === "table") {
                return (
                  <div key={index} className="my-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-extrabold">
                        <tr>
                          {block.headerCols.map((th, hIdx) => (
                            <th key={hIdx} className="px-4 py-3 font-bold text-blue-950">
                              {th}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {block.dataRows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50/60 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className="px-4 py-3"
                                dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cell) }}
                              />
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              if (block.type === "list") {
                return (
                  <ul key={index} className="my-4 space-y-2.5 pl-1">
                    {block.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="flex items-start gap-3 text-slate-700 leading-relaxed text-base sm:text-lg"
                      >
                        <span className="w-2 h-2 rounded-full bg-blue-900 mt-2.5 shrink-0" />
                        <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p
                  key={index}
                  className="leading-relaxed text-slate-700 text-base sm:text-lg"
                  dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(block.text) }}
                />
              );
            })}
          </article>

          {/* Sumber rujukan kini tampil inline (chip logo) di dalam paragraf artikel */}

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
                      <AffiliateButton
                        store="shopee"
                        href={relatedProduct.shopeeUrl}
                        productName={relatedProduct.name}
                        productId={relatedProduct.id}
                        sourcePage={`/berita/${article.slug}`}
                        className="inline-flex items-center gap-1.5 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors"
                      >
                        <span>Cek di Shopee</span>
                        <ExternalLink className="w-3 h-3" />
                      </AffiliateButton>
                      <AffiliateButton
                        store="tokopedia"
                        href={relatedProduct.tokopediaUrl}
                        productName={relatedProduct.name}
                        productId={relatedProduct.id}
                        sourcePage={`/berita/${article.slug}`}
                        className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors"
                      >
                        <span>Tokopedia</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </AffiliateButton>

                      {relatedProduct.tiktokUrl && (
                        <AffiliateButton
                          store="tiktok"
                          href={relatedProduct.tiktokUrl}
                          productName={relatedProduct.name}
                          productId={relatedProduct.id}
                          sourcePage={`/berita/${article.slug}`}
                          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          <span>TikTok Shop</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </AffiliateButton>
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
