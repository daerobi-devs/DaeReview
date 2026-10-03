"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ExternalLink,
  Search,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
  Filter,
  PlusCircle,
  Sparkles,
  Edit3,
  Trash2,
  Upload,
  Link2,
  Check,
  X,
  AlertCircle,
  Zap,
  RotateCw,
  BookOpen
} from "lucide-react";
import { BUYING_GUIDES, Product } from "@/data/mockData";
import {
  getAllProducts,
  saveProduct,
  updateProduct,
  deleteProduct,
  PRODUCTS_UPDATE_EVENT
} from "@/lib/dynamicProducts";
import { compressImage, CompressResult } from "@/lib/imageCompressor";
import { addDifyDraft } from "@/lib/dify";

export default function AdminPanduanPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<"products" | "add_product" | "guides">("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("Semua");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected products for Dify AI Multi-Product Buying Guide Curator
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [showDifyModal, setShowDifyModal] = useState(false);
  const [difyGuideTitle, setDifyGuideTitle] = useState("");
  const [isDifyCurating, setIsDifyCurating] = useState(false);

  // Edit / Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Product Form fields
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState("gadget");
  const [badge, setBadge] = useState<"PILIHAN UTAMA" | "HARGA TERBAIK" | "KUALITAS PREMIUM" | "POPULER">("PILIHAN UTAMA");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [rating, setRating] = useState<number>(4.8);
  const [reviewCount, setReviewCount] = useState<number>(150);
  const [verifiedOfficial, setVerifiedOfficial] = useState(true);
  const [image, setImage] = useState("");
  const [shopeeUrl, setShopeeUrl] = useState("");
  const [tokopediaUrl, setTokopediaUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [prosText, setProsText] = useState("");
  const [consText, setConsText] = useState("");
  const [verdict, setVerdict] = useState("");

  // TikTok Scrape state
  const [tiktokInputUrl, setTiktokInputUrl] = useState("");
  const [isScrapingTikTok, setIsScrapingTikTok] = useState(false);
  const [tiktokScrapeSuccess, setTiktokScrapeSuccess] = useState<string | null>(null);

  // Image upload compression state
  const [compressInfo, setCompressInfo] = useState<{
    originalSize: number;
    compressedSize: number;
    reduction: number;
  } | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // Load products
  useEffect(() => {
    setProducts(getAllProducts());

    const handleUpdate = () => {
      setProducts(getAllProducts());
    };

    window.addEventListener(PRODUCTS_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(PRODUCTS_UPDATE_EVENT, handleUpdate);
  }, []);

  const categories = ["Semua", "audio", "gadget", "smarthome", "dapur", "lifestyle"];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === "Semua" || p.category.toLowerCase() === selectedCat.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const filteredGuides = BUYING_GUIDES.filter((g) =>
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset form
  const resetForm = () => {
    setName("");
    setTagline("");
    setCategory("gadget");
    setBadge("PILIHAN UTAMA");
    setPrice("");
    setOriginalPrice("");
    setDiscount("");
    setRating(4.8);
    setReviewCount(150);
    setVerifiedOfficial(true);
    setImage("");
    setShopeeUrl("");
    setTokopediaUrl("");
    setTiktokUrl("");
    setProsText("");
    setConsText("");
    setVerdict("");
    setTiktokInputUrl("");
    setTiktokScrapeSuccess(null);
    setCompressInfo(null);
    setIsEditing(false);
    setEditingId(null);
  };

  // Start Edit
  const handleStartEdit = (p: Product) => {
    setIsEditing(true);
    setEditingId(p.id);
    setName(p.name);
    setTagline(p.tagline || "");
    setCategory(p.category || "gadget");
    setBadge(p.badge || "PILIHAN UTAMA");
    setPrice(p.price || "");
    setOriginalPrice(p.originalPrice || "");
    setDiscount(p.discount || "");
    setRating(p.rating || 4.8);
    setReviewCount(p.reviewCount || 100);
    setVerifiedOfficial(p.verifiedOfficial ?? true);
    setImage(p.image || "");
    setShopeeUrl(p.shopeeUrl || "");
    setTokopediaUrl(p.tokopediaUrl || "");
    setTiktokUrl(p.tiktokUrl || "");
    setProsText(p.pros ? p.pros.join("\n") : "");
    setConsText(p.cons ? p.cons.join("\n") : "");
    setVerdict(p.verdict || "");
    setActiveTab("add_product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle Save (Create or Update)
  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price.trim()) {
      alert("Nama produk dan harga wajib diisi!");
      return;
    }

    const pros = prosText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const cons = consText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const productPayload: Partial<Product> = {
      name: name.trim(),
      tagline: tagline.trim() || `Rekomendasi teruji untuk kategori ${category}.`,
      category,
      badge,
      price: price.trim(),
      originalPrice: originalPrice.trim() || undefined,
      discount: discount.trim() || undefined,
      rating: Number(rating) || 4.8,
      reviewCount: Number(reviewCount) || 100,
      verifiedOfficial,
      image:
        image.trim() ||
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      shopeeUrl: shopeeUrl.trim(),
      tokopediaUrl: tokopediaUrl.trim(),
      tiktokUrl: tiktokUrl.trim(),
      pros: pros.length > 0 ? pros : ["Material kokoh dan awet", "Garansi resmi terjamin"],
      cons: cons.length > 0 ? cons : ["Ketersediaan stok promo terbatas"],
      verdict:
        verdict.trim() ||
        "Pilihan teruji dengan rasio nilai-ke-harga tinggi untuk konsumen cerdas di Indonesia.",
    };

    if (isEditing && editingId) {
      updateProduct(editingId, productPayload);
      setToastMessage(`Produk "${name}" berhasil diperbarui!`);
    } else {
      saveProduct({
        ...productPayload,
        rank: products.length + 1,
        specs: { Garansi: "1 Tahun Resmi" },
      } as any);
      setToastMessage(`Produk "${name}" berhasil ditambahkan ke katalog!`);
    }

    resetForm();
    setActiveTab("products");
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Delete
  const handleDeleteProduct = (id: string, prodName: string) => {
    if (confirm(`Yakin ingin menghapus produk "${prodName}" dari katalog?`)) {
      deleteProduct(id);
      setToastMessage(`Produk "${prodName}" berhasil dihapus.`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // TikTok Scraper Handler
  const handleScrapeTikTok = async () => {
    if (!tiktokInputUrl.trim()) return;
    setIsScrapingTikTok(true);
    setTiktokScrapeSuccess(null);

    try {
      const res = await fetch("/api/scrape/tiktok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: tiktokInputUrl.trim() }),
      });
      const json = await res.json();

      if (json.success && json.data) {
        if (json.data.title && !name) {
          setName(json.data.title.substring(0, 80));
        }
        if (json.data.image) {
          setImage(json.data.image);
        }
        setTiktokUrl(tiktokInputUrl.trim());
        setTiktokScrapeSuccess(
          `Data TikTok berhasil ditarik: ${json.data.title?.substring(0, 40)}...`
        );
      } else {
        alert(json.error || "Gagal menarik data dari link TikTok.");
      }
    } catch (err: any) {
      alert("Terjadi kesalahan saat menghubungi scraper TikTok: " + err.message);
    } finally {
      setIsScrapingTikTok(false);
    }
  };

  // Image Upload with Auto-compress ~100KB WebP
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const result: CompressResult = await compressImage(file, {
        targetSizeKB: 100,
        maxDimension: 1200,
      });

      setImage(result.base64);
      setCompressInfo({
        originalSize: result.originalSizeKB,
        compressedSize: result.compressedSizeKB,
        reduction: result.reductionPercentage,
      });
      setToastMessage(
        `Foto berhasil dikompresi: ${result.originalSizeKB}KB ➔ ${result.compressedSizeKB}KB (Hemat ${result.reductionPercentage}%)`
      );
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      alert("Gagal mengompresi gambar. Coba gunakan foto lain.");
    } finally {
      setIsCompressing(false);
    }
  };

  // Toggle selection for multi-product Dify curation
  const toggleSelectProduct = (id: string) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((pid) => pid !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  // Generate Dify AI Single Product Review
  const handleGenerateSingleDifyReview = (p: Product) => {
    const draftTitle = `Ulasan Teruji & Komparasi Harga: ${p.name}`;
    addDifyDraft({
      type: "PANDUAN_BELANJA",
      title: draftTitle,
      category: p.category,
      summary: `Analisis mendalam ${p.name}. Skor lab ${p.rating} / 5, harga terbaik ${p.price}, dan verifikasi ulasan pembeli riil di marketplace.`,
      content: [
        `Di segmen ${p.category}, ${p.name} menarik perhatian berkat penawaran harga ${p.price} yang sangat kompetitif.`,
        `Berdasarkan pengujian spesifikasi dan audit ketahanan material kami, produk ini mencatat skor impresif ${p.rating} / 5. Keunggulan utamanya meliputi ${p.pros.join(", ")}.`,
        `Catatan redaksi: ${p.cons.join(", ")}. Secara keseluruhan, produk ini sangat kami rekomendasikan untuk Anda yang mencari solusi berkualitas tanpa boncos.`
      ],
      productRecommendations: [
        {
          name: p.name,
          price: p.price,
          specs: Object.entries(p.specs || {}).map(([k, v]) => `${k}: ${v}`).join(", ") || "Garansi Resmi",
          pros: p.pros?.join("; ") || "Kualitas teruji",
          cons: p.cons?.join("; ") || "Stok promo terbatas",
          shopeeUrl: p.shopeeUrl,
          tokopediaUrl: p.tokopediaUrl,
          tiktokUrl: p.tiktokUrl,
        }
      ]
    });

    setToastMessage(`Draft artikel ulasan untuk "${p.name}" berhasil dibuat di Dify AI Studio!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Open Multi-Product Dify Curator Modal
  const openDifyCuratorModal = () => {
    const defaultTitle =
      selectedProductIds.length > 0
        ? `${selectedProductIds.length} Rekomendasi ${selectedCat === "Semua" ? "Gadget" : selectedCat.toUpperCase()} Terbaik 2026 yang Teruji Awet`
        : "5 Rekomendasi Barang Terbaik 2026 Paling Worth-It";
    setDifyGuideTitle(defaultTitle);
    setShowDifyModal(true);
  };

  // Execute Dify AI Multi-Product Buying Guide
  const handleExecuteDifyCurator = () => {
    if (selectedProductIds.length === 0) {
      alert("Pilih minimal 1 produk dari katalog untuk dianalisis oleh Dify AI!");
      return;
    }

    setIsDifyCurating(true);

    setTimeout(() => {
      const chosenProducts = products.filter((p) => selectedProductIds.includes(p.id));
      const title = difyGuideTitle.trim() || `${chosenProducts.length} Rekomendasi Barang Terbaik 2026`;

      addDifyDraft({
        type: "PANDUAN_BELANJA",
        title,
        category: chosenProducts[0]?.category || "Gadget & Setup",
        summary: `Panduan belanja komprehensif merangkum ${chosenProducts.length} produk teruji pilihan redaksi dengan perbandingan harga resmi di Shopee, Tokopedia, dan TikTok Shop.`,
        content: [
          `Menemukan produk yang tepat di tengah ratusan pilihan e-commerce seringkali membingungkan konsumen. DaeReview menguji langsung ${chosenProducts.length} barang unggulan berikut dengan metodologi 4 lapis.`,
          `Setiap produk dalam kurasi ini telah melewati audit ulasan riil pembeli bebas bot, verifikasi keaslian distributor resmi, serta uji efisiensi biaya.`,
          `Rekomendasi redaksi: Sesuaikan pilihan Anda dengan kebutuhan harian dan budget prioritas.`
        ],
        productRecommendations: chosenProducts.map((p) => ({
          name: p.name,
          price: p.price,
          specs: Object.entries(p.specs || {}).map(([k, v]) => `${k}: ${v}`).join(", ") || "Garansi Resmi",
          pros: p.pros?.join("; ") || "Fitur lengkap & teruji",
          cons: p.cons?.join("; ") || "Stok promo cepat habis",
          shopeeUrl: p.shopeeUrl,
          tokopediaUrl: p.tokopediaUrl,
          tiktokUrl: p.tiktokUrl,
        }))
      });

      setIsDifyCurating(false);
      setShowDifyModal(false);
      setSelectedProductIds([]);
      setToastMessage(`Panduan belanja "${title}" dengan ${chosenProducts.length} produk berhasil dibuat oleh Dify AI!`);
      setTimeout(() => setToastMessage(null), 4500);
    }, 1500);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
            <ShoppingBag className="w-3.5 h-3.5 text-blue-700" />
            <span>KATALOG BARANG & MONETISASI AFILIASI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
            Katalog Produk & Panduan Belanja
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tambah produk sendiri, hubungkan link Shopee, Tokopedia, TikTok Shop, atau biarkan Dify AI meracik artikel &quot;5 Barang Terbaik&quot; otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              if (activeTab === "add_product") {
                setActiveTab("products");
                resetForm();
              } else {
                resetForm();
                setActiveTab("add_product");
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            {activeTab === "add_product" ? (
              <>
                <Layers className="w-3.5 h-3.5" />
                <span>Kembali ke Daftar Barang</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-3.5 h-3.5" />
                <span>➕ Tambah Barang / Link Baru</span>
              </>
            )}
          </button>

          <Link
            href="/#panduan"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-blue-900 text-xs font-bold transition-colors border border-slate-200 shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
            <span>Lihat di Web Live</span>
          </Link>
        </div>
      </div>

      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Barang Masuk</span>
          <p className="text-2xl font-black text-blue-950 mt-1">{products.length}</p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">Siap Monetisasi Afiliasi</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Koleksi Panduan</span>
          <p className="text-2xl font-black text-blue-950 mt-1">{BUYING_GUIDES.length}</p>
          <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">Komparasi Mendalam</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Toko Mitra Resmi</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">100%</p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Official Store Terverifikasi</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Marketplace Terhubung</span>
          <p className="text-2xl font-black text-purple-700 mt-1">3 Platform</p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Shopee, Tokopedia, TikTok</span>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 flex-wrap">
        <button
          onClick={() => {
            setActiveTab("products");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "products"
              ? "bg-blue-950 text-white shadow-xs"
              : "bg-white text-slate-600 hover:text-blue-950 border border-slate-200"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>📦 Daftar Barang / Produk ({products.length})</span>
        </button>

        <button
          onClick={() => {
            if (!isEditing) resetForm();
            setActiveTab("add_product");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "add_product"
              ? "bg-blue-950 text-white shadow-xs"
              : "bg-white text-slate-600 hover:text-blue-950 border border-slate-200"
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{isEditing ? "✏️ Edit Produk Terpilih" : "➕ Tambah / Input Barang Baru"}</span>
        </button>

        <button
          onClick={() => setActiveTab("guides")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "guides"
              ? "bg-blue-950 text-white shadow-xs"
              : "bg-white text-slate-600 hover:text-blue-950 border border-slate-200"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>📑 Koleksi Panduan Belanja ({BUYING_GUIDES.length})</span>
        </button>
      </div>

      {/* TAB 1: DAFTAR SEMUA PRODUK / BARANG */}
      {activeTab === "products" && (
        <div className="space-y-6">
          {/* Action Bar for Dify Multi-Product Batch Curator */}
          <div className="p-4 rounded-2xl bg-linear-to-r from-blue-950 to-blue-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-200 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>DIFY AI CONTENT ENGINE BATCH CURATOR</span>
              </div>
              <p className="text-xs text-blue-100">
                Pilih beberapa produk dengan mencentang kotak di bawah, lalu klik untuk meminta Dify AI membuatkan artikel <strong>&quot;5 Barang Terbaik&quot;</strong> atau panduan belanja komparatif!
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={openDifyCuratorModal}
                disabled={selectedProductIds.length === 0}
                className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-blue-950 text-xs font-extrabold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 fill-blue-950" />
                <span>
                  Buat Panduan AI dari Pilihan ({selectedProductIds.length})
                </span>
              </button>

              {selectedProductIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedProductIds([])}
                  className="px-2.5 py-2 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-xs font-semibold"
                  title="Batalkan Pilihan"
                >
                  Batal
                </button>
              )}
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama barang atau merk..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-900 text-xs shadow-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
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

          {/* Product Cards List */}
          <div className="space-y-4">
            {filteredProducts.map((p) => {
              const isSelected = selectedProductIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  className={`p-5 sm:p-6 rounded-2xl bg-white border transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xs ${
                    isSelected
                      ? "border-blue-700 ring-2 ring-blue-700/20 bg-blue-50/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    {/* Multi-select checkbox */}
                    <div className="pt-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectProduct(p.id)}
                        className="w-4 h-4 rounded text-blue-950 border-slate-300 focus:ring-blue-900 cursor-pointer"
                        title="Centang untuk kurasi Dify AI"
                      />
                    </div>

                    {/* Product Photo */}
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            p.badge === "PILIHAN UTAMA"
                              ? "bg-blue-50 text-blue-950 border border-blue-200"
                              : p.badge === "HARGA TERBAIK"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : p.badge === "KUALITAS PREMIUM"
                              ? "bg-purple-50 text-purple-800 border border-purple-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {p.badge}
                        </span>

                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {p.category}
                        </span>

                        {p.verifiedOfficial && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Official Store
                          </span>
                        )}

                        {p.isCustom && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-950 border border-blue-200">
                            PRODUK SENDIRI
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {p.name}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-1 max-w-2xl">
                        {p.tagline}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                        <div>
                          <span className="text-slate-400 text-[10px] block">HARGA TERBAIK</span>
                          <span className="font-extrabold text-blue-950 text-sm">{p.price}</span>
                          {p.discount && (
                            <span className="text-[10px] font-bold text-rose-600 ml-1.5 bg-rose-50 px-1 rounded">
                              {p.discount}
                            </span>
                          )}
                        </div>

                        <div className="border-l border-slate-200 pl-3">
                          <span className="text-slate-400 text-[10px] block">SKOR AUDIT RIIL</span>
                          <div className="flex items-center gap-1 font-bold text-slate-800">
                            <span className="text-amber-500 font-extrabold">{p.rating}</span>
                            <span className="text-slate-400 text-[10px]">/ 5</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({p.reviewCount.toLocaleString("id-ID")} ulasan)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Affiliate Link Status & Actions */}
                  <div className="w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Status Tautan Komisi Afiliasi
                    </span>

                    <div className="flex flex-wrap lg:flex-col gap-1.5">
                      {p.shopeeUrl ? (
                        <a
                          href={p.shopeeUrl}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="inline-flex items-center justify-between gap-2 px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#EE4D2D] text-[11px] font-bold transition-colors"
                        >
                          <span>🟠 Shopee Live</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          Shopee: Kosong
                        </span>
                      )}

                      {p.tokopediaUrl ? (
                        <a
                          href={p.tokopediaUrl}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="inline-flex items-center justify-between gap-2 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-bold transition-colors"
                        >
                          <span>🟢 Tokopedia Live</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          Tokopedia: Kosong
                        </span>
                      )}

                      {p.tiktokUrl ? (
                        <a
                          href={p.tiktokUrl}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="inline-flex items-center justify-between gap-2 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-black text-cyan-400 text-[11px] font-bold transition-colors"
                        >
                          <span>⚫ TikTok Shop</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          TikTok Shop: Kosong
                        </span>
                      )}
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleGenerateSingleDifyReview(p)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-950 text-[11px] font-bold border border-blue-200 transition-colors cursor-pointer"
                        title="Buat artikel ulasan produk ini lewat Dify AI"
                      >
                        <Sparkles className="w-3 h-3 text-blue-700" />
                        <span>AI Ulas</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStartEdit(p)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold border border-slate-200 transition-colors cursor-pointer"
                        title="Edit Data Produk"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      {p.isCustom && (
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: FORM TAMBAH / INPUT BARANG SENDIRI */}
      {activeTab === "add_product" && (
        <div className="bg-white border border-slate-200 shadow-xs p-6 sm:p-8 rounded-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-900" />
                <h2 className="text-lg font-bold text-blue-950">
                  {isEditing ? `Edit Produk: ${name}` : "Input Barang / Produk Afiliasi Baru"}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Masukkan detail barang, link Shopee, Tokopedia, dan TikTok Shop agar siap dikurasi atau dianalisis oleh Dify AI.
              </p>
            </div>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Batal Edit
              </button>
            )}
          </div>

          {/* Quick Import via TikTok Link */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-600" />
              <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                ⚡ Tarik Data Otomatis dari Link TikTok / TikTok Shop
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Paste tautan video TikTok review atau produk TikTok Shop (misal: <code>https://vt.tiktok.com/...</code>) untuk otomatis menarik judul dan foto thumbnail HD.
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={tiktokInputUrl}
                onChange={(e) => setTiktokInputUrl(e.target.value)}
                placeholder="https://vt.tiktok.com/ZSjabc123/ atau https://www.tiktok.com/@toko/video/..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-900 font-mono"
              />
              <button
                type="button"
                onClick={handleScrapeTikTok}
                disabled={isScrapingTikTok || !tiktokInputUrl.trim()}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-cyan-400 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs shrink-0"
              >
                {isScrapingTikTok ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menarik Data...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Tarik Data TikTok</span>
                  </>
                )}
              </button>
            </div>
            {tiktokScrapeSuccess && (
              <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{tiktokScrapeSuccess}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmitProduct} className="space-y-6">
            {/* Bagian 1: Identitas Produk */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Informasi Utama Barang
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Produk *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Baseus Bowie WM02 TWS Earphone Bluetooth 5.3"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-hidden focus:border-blue-900 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tagline Ringkas / Alasan Rekomendasi
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Contoh: TWS mungil latensi rendah dan daya tahan baterai 25 jam paling worth-it di bawah 200 ribu."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-hidden focus:border-blue-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Produk
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-hidden focus:border-blue-900 focus:bg-white"
                  >
                    <option value="gadget">Gadget & Setup</option>
                    <option value="audio">Audio & TWS</option>
                    <option value="smarthome">Smart Home</option>
                    <option value="dapur">Peralatan Dapur</option>
                    <option value="lifestyle">Gaya Hidup & Wearable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Badge Kurasi Editorial
                  </label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-hidden focus:border-blue-900 focus:bg-white"
                  >
                    <option value="PILIHAN UTAMA">PILIHAN UTAMA</option>
                    <option value="HARGA TERBAIK">HARGA TERBAIK</option>
                    <option value="KUALITAS PREMIUM">KUALITAS PREMIUM</option>
                    <option value="POPULER">POPULER</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bagian 2: Harga & Skor Ulasan */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Penetapan Harga & Skor Audit Redaksi
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Harga Terbaik / Promo *
                  </label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Rp 189.000"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-hidden focus:border-blue-900 focus:bg-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Harga Asli Coret (Opsional)
                  </label>
                  <input
                    type="text"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="Rp 350.000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-hidden focus:border-blue-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Label Diskon (Opsional)
                  </label>
                  <input
                    type="text"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="46% OFF"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-hidden focus:border-blue-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Skor Rating Numerik (1.0 - 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(parseFloat(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-hidden focus:border-blue-900 focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Standar Swiss: Rating berupa angka murni tanpa bintang palsu.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah Ulasan Terverifikasi
                  </label>
                  <input
                    type="number"
                    value={reviewCount}
                    onChange={(e) => setReviewCount(parseInt(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-hidden focus:border-blue-900 focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="officialStore"
                    checked={verifiedOfficial}
                    onChange={(e) => setVerifiedOfficial(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-950 border-slate-300 focus:ring-blue-900 cursor-pointer"
                  />
                  <label htmlFor="officialStore" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Official Store / Toko Mitra Resmi
                  </label>
                </div>
              </div>
            </div>

            {/* Bagian 3: Tautan Afiliasi 3 Marketplace */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  3. Tautan Afiliasi Marketplace (Shopee, Tokopedia, TikTok Shop)
                </h3>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Monetisasi 100% Milikmu
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-28 text-xs font-bold text-[#EE4D2D] flex items-center gap-1.5 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#EE4D2D]" />
                    <span>Shopee URL:</span>
                  </span>
                  <input
                    type="url"
                    value={shopeeUrl}
                    onChange={(e) => setShopeeUrl(e.target.value)}
                    placeholder="https://shopee.co.id/universal-link-affiliate..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-hidden focus:border-blue-900 focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-28 text-xs font-bold text-emerald-700 flex items-center gap-1.5 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>Tokopedia URL:</span>
                  </span>
                  <input
                    type="url"
                    value={tokopediaUrl}
                    onChange={(e) => setTokopediaUrl(e.target.value)}
                    placeholder="https://tokopedia.com/toko/produk..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-hidden focus:border-blue-900 focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-28 text-xs font-bold text-slate-900 flex items-center gap-1.5 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-slate-900" />
                    <span>TikTok Shop URL:</span>
                  </span>
                  <input
                    type="url"
                    value={tiktokUrl}
                    onChange={(e) => setTiktokUrl(e.target.value)}
                    placeholder="https://vt.tiktok.com/ZSjabc123/ atau https://shop.tiktok.com/..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-hidden focus:border-blue-900 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Bagian 4: Foto Produk & Auto-Kompres */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                4. Foto Produk (Auto-Kompres WebP ~100KB)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <label className="block text-xs font-semibold text-slate-700">
                    Upload Foto dari Komputer
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-950 file:text-white hover:file:bg-blue-900 cursor-pointer"
                  />
                  {isCompressing && (
                    <div className="text-xs text-blue-900 font-semibold flex items-center gap-1.5 animate-pulse">
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Mengompresi gambar ke WebP ~100KB...</span>
                    </div>
                  )}
                  {compressInfo && (
                    <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                      ✅ Berhasil dikompresi: {compressInfo.originalSize} KB ➔ <strong>{compressInfo.compressedSize} KB</strong> (Hemat {compressInfo.reduction}%)
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Atau Masukkan URL Gambar Online
                  </label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... atau link CDN gambar produk"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-hidden focus:border-blue-900 focus:bg-white"
                  />
                  {image && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mt-2">
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bagian 5: Kelebihan, Kekurangan, & Vonis */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                5. Kelebihan, Kekurangan & Vonis Redaksi
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-emerald-800 mb-1">
                    Kelebihan / Pros (1 poin per baris)
                  </label>
                  <textarea
                    rows={3}
                    value={prosText}
                    onChange={(e) => setProsText(e.target.value)}
                    placeholder="Baterai awet hingga 25 jam&#10;Latensi rendah 0.06 detik&#10;Desain kapsul transparan elegan"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-hidden focus:border-blue-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-800 mb-1">
                    Kekurangan / Cons (1 poin per baris)
                  </label>
                  <textarea
                    rows={3}
                    value={consText}
                    onChange={(e) => setConsText(e.target.value)}
                    placeholder="Belum ada Active Noise Cancelling (ANC)&#10;Bass standar untuk musik EDM"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-hidden focus:border-blue-900 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vonis Akhir Redaksi (Verdict)
                  </label>
                  <textarea
                    rows={2}
                    value={verdict}
                    onChange={(e) => setVerdict(e.target.value)}
                    placeholder="TWS paling worth-it di rentang harga di bawah 200 ribu untuk pengguna harian dan gaming kasual."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-hidden focus:border-blue-900 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setActiveTab("products");
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isEditing ? "💾 Simpan Perubahan Produk" : "💾 Simpan Produk ke Katalog"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: KOLEKSI PANDUAN BELANJA */}
      {activeTab === "guides" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari panduan belanja atau kategori..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-900 text-xs shadow-xs"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={guide.coverImage}
                      alt={guide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-bold text-blue-900">
                        {guide.categoryName}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">{guide.products.length} Produk Terpilih</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">Editor: {guide.author.name}</span>
                    </div>
                    <h3 className="text-base font-bold text-blue-950 leading-snug">
                      {guide.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-1">
                      {guide.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 w-full lg:w-auto justify-end border-t lg:border-t-0 border-slate-100 pt-3 lg:pt-0">
                  <Link
                    href={`/panduan/${guide.slug}`}
                    target="_blank"
                    className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-blue-950 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <span>Lihat Panduan</span>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dify AI Multi-Product Curator Modal */}
      {showDifyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-900" />
                <h3 className="text-base font-bold text-blue-950">
                  Dify AI Multi-Product Curator
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDifyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Dify AI akan menganalisis {selectedProductIds.length} produk pilihanmu, mengompilasi harga dari Shopee, Tokopedia, dan TikTok Shop, lalu meracik draf artikel kurasi <strong>&quot;Rekomendasi Barang Terbaik&quot;</strong>.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Panduan Belanja AI:
                </label>
                <input
                  type="text"
                  value={difyGuideTitle}
                  onChange={(e) => setDifyGuideTitle(e.target.value)}
                  placeholder="Contoh: 5 Rekomendasi TWS Murah Terbaik 2026 yang Teruji Awet"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-hidden focus:border-blue-900"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Produk yang akan Dianalisis ({selectedProductIds.length}):
                </span>
                <div className="max-h-40 overflow-y-auto space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {products
                    .filter((p) => selectedProductIds.includes(p.id))
                    .map((p) => (
                      <div key={p.id} className="text-xs flex items-center justify-between text-slate-800">
                        <span className="font-semibold truncate max-w-xs">{p.name}</span>
                        <span className="text-emerald-700 font-bold shrink-0">{p.price}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDifyModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleExecuteDifyCurator}
                disabled={isDifyCurating}
                className="px-5 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-xs disabled:opacity-50"
              >
                {isDifyCurating ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Dify AI Sedang Menganalisis...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                    <span>🚀 Jalankan Analisis Dify AI Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
