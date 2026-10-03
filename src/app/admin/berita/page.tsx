"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Newspaper,
  ExternalLink,
  Plus,
  CheckCircle2,
  Clock,
  Search,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Trash2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Tag,
  Eye,
  ArrowRight,
  RefreshCw,
  FileCheck,
  Pencil
} from "lucide-react";
import { MOCK_NEWS, MOCK_PRODUCTS, NewsArticle } from "@/data/mockData";
import {
  getAllArticles,
  saveArticle,
  updateArticle,
  deleteCustomArticle,
  slugify,
  NEWS_UPDATE_EVENT
} from "@/lib/dynamicNews";
import { compressImage, CompressResult } from "@/lib/imageCompressor";

type NewsCategory =
  | "Fakta vs Mitos"
  | "Teknologi & AI"
  | "Gadget"
  | "Tren Belanja"
  | "Smart Home"
  | "Tips Hemat"
  | "Audio & Setup"
  | "Peralatan Dapur";

export default function AdminBeritaPage() {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("Semua");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form States
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<NewsCategory>("Teknologi & AI");
  const [author, setAuthor] = useState("Tim Riset DaeReview");
  const [readTime, setReadTime] = useState("4 menit");
  const [summary, setSummary] = useState("");
  const [contentRaw, setContentRaw] = useState("");
  const [isTrending, setIsTrending] = useState(false);
  const [relatedProductId, setRelatedProductId] = useState("");

  // Fact check specific states
  const [isFactCheck, setIsFactCheck] = useState(true);
  const [verdictFactCheck, setVerdictFactCheck] = useState<"FAKTA" | "MITOS" | "SEBAGIAN BENAR">("MITOS");
  const [quickTakeaway, setQuickTakeaway] = useState("");

  // TikTok Auto-Fetch States
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [isScrapingTikTok, setIsScrapingTikTok] = useState(false);
  const [tiktokScrapeNote, setTiktokScrapeNote] = useState<string | null>(null);

  // Image upload & compression states
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [compressStats, setCompressStats] = useState<CompressResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressError, setCompressError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScrapeTikTok = async () => {
    if (!tiktokUrl.trim()) {
      alert("Masukkan tautan video atau produk TikTok terlebih dahulu.");
      return;
    }

    try {
      setIsScrapingTikTok(true);
      setTiktokScrapeNote(null);

      const res = await fetch("/api/scrape/tiktok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: tiktokUrl.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (!title && data.title) {
          handleTitleChange(data.title);
        }
        if (!imageDataUrl && data.image) {
          setImageDataUrl(data.image);
        }
        if (!summary && data.summary) {
          setSummary(data.summary);
        }
        setTiktokScrapeNote(data.message || `Data berhasil ditarik dari ${data.source || "TikTok"}!`);
      } else {
        alert(data.error || "Gagal mengambil data dari TikTok.");
      }
    } catch (err: any) {
      alert("Terjadi kesalahan saat memproses data TikTok.");
    } finally {
      setIsScrapingTikTok(false);
    }
  };

  // Load articles
  const loadArticles = () => {
    const all = getAllArticles();
    setArticles(all);
  };

  useEffect(() => {
    loadArticles();

    const handleUpdate = () => {
      loadArticles();
    };

    window.addEventListener(NEWS_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(NEWS_UPDATE_EVENT, handleUpdate);
  }, []);

  // Update slug automatically when title changes
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(slugify(val));
  };

  // Handle category change
  const handleCategoryChange = (cat: NewsCategory) => {
    setCategory(cat);
    if (cat === "Fakta vs Mitos") {
      setIsFactCheck(true);
    } else {
      setIsFactCheck(false);
    }
  };

  // Handle image upload & auto-compress
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setCompressError("File yang diunggah harus berupa gambar (JPG, PNG, WebP).");
      return;
    }

    try {
      setIsCompressing(true);
      setCompressError(null);

      // Target ~100KB compression
      const result = await compressImage(file, {
        maxDimension: 1200,
        targetSizeKB: 100,
        initialQuality: 0.82,
      });

      setCompressStats(result);
      setImageDataUrl(result.base64);
    } catch (err: any) {
      setCompressError(err.message || "Gagal mengompres gambar.");
    } finally {
      setIsCompressing(false);
    }
  };

  // Preset sample image if user has no photo
  const handleUsePresetImage = (url: string) => {
    setImageDataUrl(url);
    setCompressStats(null);
  };

  // Handle article submit
  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim()) {
      alert("Judul artikel wajib diisi.");
      return;
    }

    if (!summary.trim()) {
      alert("Ringkasan singkat artikel wajib diisi.");
      return;
    }

    const finalImage =
      imageDataUrl ||
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80";

    // Parse paragraphs from textarea
    const paragraphs = contentRaw
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const articleData: Omit<NewsArticle, "id" | "date"> = {
      title: title.trim(),
      slug: slug.trim(),
      category,
      readTime: readTime.trim() || "3 menit",
      image: finalImage,
      summary: summary.trim(),
      author: author.trim() || "Tim Riset DaeReview",
      content:
        paragraphs.length > 0
          ? paragraphs
          : [summary.trim(), "Informasi selengkapnya sedang disempurnakan oleh tim editorial."],
      isTrending,
      relatedProductId: relatedProductId || undefined,
      isFactCheck: isFactCheck || category === "Fakta vs Mitos",
      verdictFactCheck: (isFactCheck || category === "Fakta vs Mitos") ? verdictFactCheck : undefined,
      quickTakeaway:
        (isFactCheck || category === "Fakta vs Mitos") ? quickTakeaway.trim() || summary.trim() : undefined,
      tiktokUrl: tiktokUrl.trim() || undefined,
    };

    if (isEditing && editingId) {
      // Mode Edit / Perbarui
      updateArticle(editingId, articleData);

      try {
        await fetch("/api/news", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...articleData }),
        });
      } catch (err) {
        console.warn("API update note:", err);
      }

      setSuccessToast(`Perubahan artikel "${articleData.title}" berhasil disimpan!`);
      setTimeout(() => setSuccessToast(null), 4000);
      handleCancelEdit();
      return;
    }

    // Mode Buat Baru
    const saved = saveArticle(articleData);

    try {
      await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saved),
      });
    } catch (err) {
      console.warn("API sync note:", err);
    }

    setSuccessToast(`Artikel "${saved.title}" berhasil diterbitkan!`);
    setTimeout(() => setSuccessToast(null), 4000);
    handleCancelEdit();
  };

  const handleStartEdit = (article: NewsArticle) => {
    setIsEditing(true);
    setEditingId(article.id);
    setTitle(article.title);
    setSlug(article.slug);
    setCategory(article.category);
    setAuthor(article.author || "Tim Riset DaeReview");
    setReadTime(article.readTime || "4 menit");
    setSummary(article.summary || "");
    setContentRaw((article.content || []).join("\n\n"));
    setImageDataUrl(article.image || "");
    setIsTrending(article.isTrending || false);
    setRelatedProductId(article.relatedProductId || "");
    setTiktokUrl(article.tiktokUrl || "");

    const isFC = Boolean(article.isFactCheck || article.category === "Fakta vs Mitos");
    setIsFactCheck(isFC);
    if (article.verdictFactCheck) {
      setVerdictFactCheck(article.verdictFactCheck);
    }
    setQuickTakeaway(article.quickTakeaway || "");

    setActiveTab("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle("");
    setSlug("");
    setCategory("Teknologi & AI");
    setIsFactCheck(false);
    setSummary("");
    setContentRaw("");
    setImageDataUrl("");
    setCompressStats(null);
    setQuickTakeaway("");
    setTiktokUrl("");
    setTiktokScrapeNote(null);
    setActiveTab("list");
  };

  const handleDeleteArticle = async (article: NewsArticle) => {
    if (!confirm(`Hapus artikel "${article.title}"?`)) return;

    deleteCustomArticle(article.id);
    try {
      await fetch(`/api/news?id=${encodeURIComponent(article.id)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("API delete note:", err);
    }

    setSuccessToast(`Artikel "${article.title}" berhasil dihapus.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const categoriesList = [
    "Semua",
    "Fakta vs Mitos",
    "Teknologi & AI",
    "Gadget",
    "Tren Belanja",
    "Smart Home",
    "Tips Hemat",
    "Audio & Setup",
    "Peralatan Dapur",
  ];

  const filteredNews = articles.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === "Semua" || item.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-emerald-600 text-white shadow-xl animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
            <Newspaper className="w-3.5 h-3.5 text-blue-700" />
            <span>KONTEN EDITORIAL & CEK FAKTA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
            Kabar, Tren & Fakta vs Mitos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tulis berita, tren teknologi, atau debunking mitos elektronik untuk menaikkan peringkat Google & media sosial.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/berita"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-blue-950 text-xs font-bold transition-colors border border-slate-200 shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
            <span>Lihat Hub Berita</span>
          </Link>

          <button
            onClick={() => setActiveTab(activeTab === "list" ? "create" : "list")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
          >
            {activeTab === "list" ? (
              <>
                <Plus className="w-4 h-4 text-white" />
                <span>✍️ Tulis Artikel Baru</span>
              </>
            ) : (
              <>
                <Newspaper className="w-4 h-4 text-white" />
                <span>Lihat Semua Artikel ({articles.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "list"
              ? "bg-blue-950 text-white shadow-xs"
              : "bg-white text-slate-600 hover:text-blue-950 border border-slate-200"
          }`}
        >
          <Newspaper className="w-3.5 h-3.5" />
          <span>Daftar Artikel ({articles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "create"
              ? "bg-blue-950 text-white shadow-xs"
              : "bg-white text-slate-600 hover:text-blue-950 border border-slate-200"
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Form Input Manual Baru</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
            Auto-Kompres ~100KB
          </span>
        </button>
      </div>

      {/* TAB 1: LIST ARTIKEL */}
      {activeTab === "list" && (
        <div className="space-y-6">
          {/* Filter and Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari artikel berita, tren, atau mitos..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-900 text-xs shadow-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedCat === cat
                      ? "bg-blue-950 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:text-blue-950 border border-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles List */}
          <div className="space-y-3">
            {filteredNews.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
                Tidak ada artikel yang cocok dengan filter. Klik tab <strong>"✍️ Form Input Manual Baru"</strong> untuk menerbitkan artikel pertama!
              </div>
            ) : (
              filteredNews.map((article) => (
                <div
                  key={article.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-950 border border-blue-200 text-[10px] font-extrabold uppercase">
                          {article.category}
                        </span>

                        {article.verdictFactCheck && (
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                              article.verdictFactCheck === "MITOS"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : article.verdictFactCheck === "FAKTA"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            [VONIS: {article.verdictFactCheck}]
                          </span>
                        )}

                        {article.isCustom ? (
                          <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-extrabold">
                            ✍️ Dibuat Manual
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                            Bawaan Redaksi
                          </span>
                        )}

                        {article.isTrending && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Trending
                          </span>
                        )}
                      </div>

                      <h2 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                        {article.title}
                      </h2>

                      <p className="text-xs text-slate-500 line-clamp-1 max-w-2xl">
                        {article.summary}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-0.5">
                        <span>Oleh: {article.author}</span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                        <span>•</span>
                        <span>{article.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Link
                      href={`/berita/${article.slug}`}
                      target="_blank"
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-blue-950 text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-700" />
                      <span>Lihat</span>
                    </Link>

                    <button
                      onClick={() => handleStartEdit(article)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-950 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Edit artikel ini"
                    >
                      <Pencil className="w-3.5 h-3.5 text-blue-800" />
                      <span>Edit</span>
                    </button>

                    {article.isCustom && (
                      <button
                        onClick={() => handleDeleteArticle(article)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Hapus artikel ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FORM INPUT & EDIT MANUAL ARTIKEL */}
      {activeTab === "create" && (
        <form onSubmit={handleSubmitArticle} className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2">
                  <span>{isEditing ? "✏️ Mode Edit: Perbarui Artikel" : "✍️ Buat & Terbitkan Artikel Baru"}</span>
                  {isEditing && (
                    <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-full">
                      SEDANG DI-EDIT
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isEditing
                    ? "Perbaiki isi tulisan, gambar, link afiliasi, atau vonis mitos. Klik simpan untuk langsung mengupdate di web live."
                    : "Pilih format artikel standar atau cek fakta. Foto akan otomatis dikompres ke WebP (~100KB)."}
                </p>
              </div>

              {isEditing ? (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors"
                >
                  Batal Edit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsFactCheck(false);
                    setTitle("Review Robot Vacuum Cleaner Xiaomi vs Dreame 2026: Mana yang Bersihnya Tuntas?");
                    setSlug(slugify("Review Robot Vacuum Cleaner Xiaomi vs Dreame 2026: Mana yang Bersihnya Tuntas?"));
                    setCategory("Smart Home");
                    setSummary("Komparasi uji sedot debu karpet, pemetaan LiDAR, dan ketahanan baterai untuk rumah tangga Indonesia.");
                    setContentRaw("Robot vacuum cleaner semakin populer di kalangan pekerja kantoran yang tidak memiliki banyak waktu untuk menyapu dan mengepel lantai setiap hari.\n\nDalam pengujian lab independen selama 14 hari, Xiaomi unggul pada aplikasi yang responsif, sedangkan Dreame memiliki daya hisap lebih kuat pada karpet tebal.\n\nKesimpulannya, untuk apartemen berlantai keramik Xiaomi adalah pilihan paling hemat, sedangkan rumah bertingkat lebih cocok dengan Dreame.");
                  }}
                  className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100 transition-colors"
                >
                  Gunakan Contoh Data
                </button>
              )}
            </div>

            {/* Pilihan Format Konten: Standar vs Cek Fakta */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
              <label className="block text-xs font-bold text-blue-950 uppercase tracking-wider">
                Pilih Tipe / Varian Artikel:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsFactCheck(false);
                    if (category === "Fakta vs Mitos") setCategory("Teknologi & AI");
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-start gap-2.5 cursor-pointer ${
                    !isFactCheck
                      ? "bg-white border-blue-950 text-blue-950 shadow-xs ring-2 ring-blue-950/10"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-white"
                  }`}
                >
                  <Newspaper className="w-4 h-4 mt-0.5 text-blue-900 shrink-0" />
                  <div>
                    <span>Artikel Standar (Berita, Tren, Tips, Review)</span>
                    <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                      Bebas tanpa vonis redaksi. Cocok untuk kabar teknologi, tren belanja, gadget, atau tips hemat.
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsFactCheck(true);
                    setCategory("Fakta vs Mitos");
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-start gap-2.5 cursor-pointer ${
                    isFactCheck
                      ? "bg-white border-blue-950 text-blue-950 shadow-xs ring-2 ring-blue-950/10"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-white"
                  }`}
                >
                  <HelpCircle className="w-4 h-4 mt-0.5 text-orange-600 shrink-0" />
                  <div>
                    <span>Rubrik Cek Fakta (Fakta vs Mitos)</span>
                    <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                      Menyertakan kotak Vonis Redaksi (Mitos / Fakta / Sebagian Benar) untuk debunking isu elektronik/gadget.
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Auto-Fetch TikTok Affiliate Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Otomasi Link TikTok / TikTok Shop (Opsional)
                  </span>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  Auto-Fetch Preview
                </span>
              </div>

              <p className="text-xs text-slate-300">
                Punya link video review atau tautan produk afiliasi TikTok? Tempel link di sini untuk menarik judul & foto barang secara otomatis:
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="url"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="https://vt.tiktok.com/... atau https://www.tiktok.com/@user/video/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-cyan-400 font-mono"
                />
                <button
                  type="button"
                  onClick={handleScrapeTikTok}
                  disabled={isScrapingTikTok}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isScrapingTikTok ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Menarik Data...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                      <span>⚡ Tarik Data TikTok</span>
                    </>
                  )}
                </button>
              </div>

              {tiktokScrapeNote && (
                <div className="text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 p-2 rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{tiktokScrapeNote}</span>
                </div>
              )}
            </div>

            {/* Judul & Slug */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Judul Artikel / Cek Fakta <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Contoh: Fakta vs Mitos: Benarkah Sering Nyalakan AC Suhu 16 Derajat Bikin Kompresor Cepat Jebol?"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-900 focus:bg-white text-sm font-semibold transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  URL Slug (SEO Friendly)
                </label>
                <div className="flex items-center rounded-xl bg-slate-100 border border-slate-200 overflow-hidden text-xs">
                  <span className="px-3.5 py-2.5 text-slate-500 bg-slate-200/60 font-mono">
                    daereview.daeroom.my.id/berita/
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="kebiasaan-ac-suhu-16-bikin-jebol"
                    className="flex-1 px-3 py-2.5 bg-transparent text-blue-950 font-mono focus:outline-hidden font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Kategori & Spesifik Fakta vs Mitos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Kategori Konten
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as NewsCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-hidden focus:border-blue-900 focus:bg-white cursor-pointer"
                >
                  <option value="Fakta vs Mitos">🔍 Fakta vs Mitos (Universal Debunking)</option>
                  <option value="Teknologi & AI">🤖 Teknologi & AI</option>
                  <option value="Gadget">📱 Gadget & Setup</option>
                  <option value="Tren Belanja">📈 Tren Belanja</option>
                  <option value="Smart Home">🏠 Smart Home & Elektronik</option>
                  <option value="Tips Hemat">💡 Tips Hemat & Beli Cerdas</option>
                  <option value="Audio & Setup">🎧 Audio & TWS</option>
                  <option value="Peralatan Dapur">🍳 Peralatan Dapur</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nama Penulis / Redaksi
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Tim Riset DaeReview"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-hidden focus:border-blue-900 focus:bg-white"
                />
              </div>
            </div>

            {/* Conditional Box: Fakta vs Mitos Verdict */}
            {(isFactCheck || category === "Fakta vs Mitos") && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border-2 border-blue-200 space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-900" />
                  <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                    Vonis Redaksi untuk Debunking Mitos
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setVerdictFactCheck("MITOS")}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                      verdictFactCheck === "MITOS"
                        ? "bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-200"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    ❌ VONIS: MITOS
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">Klaim tidak terbukti / salah</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerdictFactCheck("FAKTA")}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                      verdictFactCheck === "FAKTA"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-200"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    ✅ VONIS: FAKTA
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">Terbukti secara ilmiah & uji teknis</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerdictFactCheck("SEBAGIAN BENAR")}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                      verdictFactCheck === "SEBAGIAN BENAR"
                        ? "bg-amber-50 border-amber-500 text-amber-700 ring-2 ring-amber-200"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    ⚠️ SEBAGIAN BENAR
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">Ada konteks & batasan tertentu</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Intisari Vonis (Quick Takeaway)
                  </label>
                  <input
                    type="text"
                    value={quickTakeaway}
                    onChange={(e) => setQuickTakeaway(e.target.value)}
                    placeholder="Contoh: Kompresor inverter modern memodulasi frekuensi secara otomatis, suhu 16 hanya membuat kipas kerja maksimal lebih lama."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-hidden focus:border-blue-900"
                  />
                </div>
              </div>
            )}

            {/* Ringkasan / Meta Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Ringkasan Eksekutif (Meta Description & Excerpt) <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Tulis 1-2 kalimat ringkasan yang menarik agar artikel diklik saat muncul di hasil pencarian Google atau dibagikan di WhatsApp..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-900 focus:bg-white text-xs leading-relaxed"
              />
            </div>

            {/* FOTO SAMPUL & AUTO-COMPRESS TO ~100KB */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Foto Sampul (Otomatis Dikompres ke WebP ~100KB) <span className="text-rose-500">*</span>
                </label>
                {compressStats && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Hemat {compressStats.reductionPercentage}% Ukuran Data!
                  </span>
                )}
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-900 bg-slate-50 hover:bg-blue-50/30 transition-all cursor-pointer text-center group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center text-blue-900 transition-colors">
                    {isCompressing ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-950">
                      {isCompressing ? "Sedang Mengompres Gambar..." : "Klik untuk Pilih Foto dari Laptop / Komputer"}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Mendukung JPG, PNG, atau WebP. Sistem kami langsung mengecilkan ke target ~100KB tanpa buram.
                    </p>
                  </div>
                </div>
              </div>

              {compressError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{compressError}</span>
                </div>
              )}

              {/* Preview Hasil Kompresi */}
              {imageDataUrl && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-36 h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={imageDataUrl}
                      alt="Preview Sampul"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1.5 text-xs flex-1">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-slate-900">
                        {compressStats ? "Foto Siap Terbit (Terkompresi Efisien)" : "Menggunakan URL Gambar"}
                      </span>
                    </div>

                    {compressStats && (
                      <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-slate-400 block text-[9px]">ASLI</span>
                          <span className="font-bold text-slate-700">{compressStats.originalSizeKB} KB</span>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                          <span className="text-emerald-600 block text-[9px]">HASIL KOMPRES</span>
                          <span className="font-bold text-emerald-700">{compressStats.compressedSizeKB} KB</span>
                        </div>
                        <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                          <span className="text-blue-600 block text-[9px]">RESOLUSI</span>
                          <span className="font-bold text-blue-900">{compressStats.width}×{compressStats.height}px</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setImageDataUrl("");
                      setCompressStats(null);
                    }}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-rose-600"
                    title="Hapus foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Opsi Preset Cepat jika tidak punya foto di komputer */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-500">Atau pilih foto teknologi siap pakai:</span>
                <button
                  type="button"
                  onClick={() => handleUsePresetImage("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80")}
                  className="text-[11px] text-blue-700 hover:underline cursor-pointer"
                >
                  Cyber & AI
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => handleUsePresetImage("https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1200&q=80")}
                  className="text-[11px] text-blue-700 hover:underline cursor-pointer"
                >
                  Gadget & Charger
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => handleUsePresetImage("https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80")}
                  className="text-[11px] text-blue-700 hover:underline cursor-pointer"
                >
                  Smart Home
                </button>
              </div>
            </div>

            {/* Isi Konten Lengkap Artikel */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Isi Lengkap Artikel (Paragraf demi Paragraf)
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                Tekan <strong>Enter 2 kali</strong> (baris kosong) untuk memisahkan setiap paragraf. Format otomatis dibuat rapi dengan jarak antar paragraf standar editorial.
              </p>
              <textarea
                rows={8}
                value={contentRaw}
                onChange={(e) => setContentRaw(e.target.value)}
                placeholder="Paragraf pertama: Pembuka fakta atau fenomena yang dibahas...&#10;&#10;Paragraf kedua: Ulasan teknis, data pengujian lab, atau alasan mendalam...&#10;&#10;Paragraf ketiga: Rekomendasi solusi bagi pembaca..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-900 focus:bg-white text-xs leading-relaxed font-sans"
              />
            </div>

            {/* Tautkan Produk Afiliasi & Opsi Tambahan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tautkan Produk Terkait (Opsional)
                </label>
                <select
                  value={relatedProductId}
                  onChange={(e) => setRelatedProductId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-hidden focus:border-blue-900 cursor-pointer"
                >
                  <option value="">-- Tidak Ada Produk Tertaut --</option>
                  {MOCK_PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.price})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Jika dipilih, artikel akan menampilkan widget box beli di Shopee / Tokopedia secara otomatis.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Visibilitas & Promosi
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="w-4 h-4 text-blue-950 rounded-sm focus:ring-blue-900 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    🔥 Tampilkan sebagai Artikel Trending & Headline
                  </span>
                </label>
              </div>
            </div>

            {/* Tombol Terbitkan / Simpan */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                {isEditing ? "Batal Edit" : "Batal"}
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isEditing ? "💾 Simpan Perubahan Artikel" : "🚀 Terbitkan Artikel Sekarang"}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
