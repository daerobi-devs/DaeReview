"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Tag,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Laptop,
  Headphones,
  Home,
  Coffee,
  Watch,
  Grid,
  Sparkles,
  Zap,
  ShieldCheck
} from "lucide-react";
import {
  CategoryItem,
  getDynamicCategories,
  addDynamicCategory,
  deleteDynamicCategory,
  resetDynamicCategories
} from "@/lib/dynamicCategories";

const ICON_OPTIONS = [
  { label: "Laptop / Gadget", value: "Laptop", Icon: Laptop },
  { label: "Headphone / Audio", value: "Headphones", Icon: Headphones },
  { label: "Rumah / Smart Home", value: "Home", Icon: Home },
  { label: "Dapur / Kopi", value: "Coffee", Icon: Coffee },
  { label: "Gaya Hidup / Jam", value: "Watch", Icon: Watch },
  { label: "Grid / Umum", value: "Grid", Icon: Grid },
  { label: "AI / Canggih", value: "Sparkles", Icon: Sparkles },
  { label: "Kilat / Promo", value: "Zap", Icon: Zap },
  { label: "Keamanan / Trust", value: "ShieldCheck", Icon: ShieldCheck },
];

export default function AdminKategoriPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("Laptop");
  const [description, setDescription] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setCategories(getDynamicCategories());
  }, []);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated = addDynamicCategory({
      name: name.trim(),
      icon,
      description: description.trim() || `Panduan belanja dan rekomendasi teruji seputar ${name.trim()}`,
    });

    setCategories(updated);
    setName("");
    setDescription("");
    setToastMessage(`Kategori "${name.trim()}" berhasil ditambahkan & langsung live!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDeleteCategory = (id: string, catName: string) => {
    if (id === "semua") {
      alert("Kategori 'Semua Kategori' adalah induk sistem dan tidak dapat dihapus.");
      return;
    }
    if (confirm(`Yakin ingin menghapus kategori "${catName}"?`)) {
      const updated = deleteDynamicCategory(id);
      setCategories(updated);
      setToastMessage(`Kategori "${catName}" berhasil dihapus.`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleReset = () => {
    if (confirm("Reset seluruh kategori ke pengaturan awal bawaan DaeReview?")) {
      const reset = resetDynamicCategories();
      setCategories(reset);
      setToastMessage("Kategori berhasil direset ke default.");
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Laptop": return <Laptop className="w-4 h-4 text-blue-800" />;
      case "Headphones": return <Headphones className="w-4 h-4 text-blue-700" />;
      case "Home": return <Home className="w-4 h-4 text-emerald-700" />;
      case "Coffee": return <Coffee className="w-4 h-4 text-amber-700" />;
      case "Watch": return <Watch className="w-4 h-4 text-purple-700" />;
      case "Sparkles": return <Sparkles className="w-4 h-4 text-indigo-700" />;
      case "Zap": return <Zap className="w-4 h-4 text-yellow-700" />;
      case "ShieldCheck": return <ShieldCheck className="w-4 h-4 text-teal-700" />;
      default: return <Grid className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-8">
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
            <Tag className="w-3.5 h-3.5 text-blue-700" />
            <span>ARSITEKTUR KONTEN DINAMIS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
            Kelola Kategori Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tambah, edit, atau hapus kategori belanja secara instan. Perubahan langsung otomatis sinkron ke seluruh landing page dan navigasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors cursor-pointer border border-slate-200 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
          <Link
            href="/#kategori"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-blue-900 text-xs font-bold transition-colors border border-slate-200 shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
            <span>Cek di Web Live</span>
          </Link>
        </div>
      </div>

      {/* Two Column Layout: Add Form + Live List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Add Category Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 shadow-xs p-6 rounded-2xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Plus className="w-4 h-4 text-blue-900" />
            <h2 className="text-sm font-bold text-blue-950 uppercase tracking-wider">
              Tambah Kategori Baru
            </h2>
          </div>

          <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Nama Kategori
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Audio & Studio, Perlengkapan Bayi..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-900 focus:bg-white text-xs transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Pilih Icon Visual
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ICON_OPTIONS.map((item) => {
                  const isSelected = icon === item.value;
                  const ItemIcon = item.Icon;
                  return (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() => setIcon(item.value)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-[11px] font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 border-blue-800 text-blue-950 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                      }`}
                    >
                      <ItemIcon className="w-4 h-4 mb-1" />
                      <span className="truncate w-full text-center">{item.value}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Deskripsi Singkat (Muncul di Tooltip / SEO)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan ringkas produk yang masuk kategori ini..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-900 focus:bg-white text-xs leading-relaxed transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold transition-colors cursor-pointer text-xs flex items-center justify-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan & Aktifkan di Landing Page</span>
            </button>
          </form>

          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-blue-900">
              <AlertCircle className="w-3.5 h-3.5 text-blue-700" />
              <span>Sistem Dinamis Otomatis</span>
            </div>
            <p className="text-slate-600">
              Begitu kamu klik simpan, kategori baru langsung muncul di tab filter Panduan Belanja dan filter Pencarian tanpa refresh.
            </p>
          </div>
        </div>

        {/* Right Column: List of Categories */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-1">
            DAFTAR KATEGORI AKTIF SAAT INI ({categories.length}):
          </div>

          <div className="space-y-2.5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-center shrink-0">
                    {renderIcon(cat.icon)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-950 text-sm">
                        {cat.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        slug: #{cat.id}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  {cat.id !== "semua" ? (
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Hapus Kategori"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400 uppercase px-2 py-1 bg-slate-100 rounded border border-slate-200">
                      Sistem
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
