"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Tag,
  ShoppingBag,
  Newspaper,
  Search,
  ExternalLink,
  Shield,
  Server,
  Menu,
  X,
  ChevronRight,
  Database,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react";
import Logo from "@/components/Logo";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const DEFAULT_ADMIN_PIN = "dae2026";
const AUTH_KEY = "daereview_admin_auth_token";
const CUSTOM_PIN_KEY = "daereview_admin_master_pin";

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [isVerifying, setIsVerifying] = useState(false);

  // Check auth state on client mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const keyParam = searchParams.get("key");

    if (keyParam) {
      // Auto verify secret query key with server
      fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: keyParam }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.token) {
            localStorage.setItem(AUTH_KEY, data.token);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        })
        .catch(() => setIsAuthenticated(false));
      return;
    }

    const authStatus = localStorage.getItem(AUTH_KEY);
    if (authStatus) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinInput }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem(AUTH_KEY, data.token);
        setIsAuthenticated(true);
        setAuthError(null);
      } else {
        setAuthError(data.error || "Password / Kunci keamanan salah. Akses ditolak.");
      }
    } catch (err) {
      setAuthError("Gagal menghubungi server verifikasi.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    if (confirm("Kunci kembali dashboard admin ini?")) {
      localStorage.removeItem(AUTH_KEY);
      setIsAuthenticated(false);
      setPinInput("");
    }
  };

  // Prevent flicker before client hydration
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // GATE KEAMANAN: Tampilkan layar kunci jika belum terautentikasi
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center px-4 font-sans selection:bg-blue-100 selection:text-blue-900">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex p-3.5 rounded-2xl bg-blue-50 text-blue-950 border border-blue-200">
              <Lock className="w-8 h-8 text-blue-900" />
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Logo size="sm" />
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-950 text-white px-2 py-0.5 rounded">
                  PROTECTED
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-blue-950 tracking-tight">
                Akses Terproteksi Redaksi
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Halaman admin ini disembunyikan dari Google (NoIndex) dan dilindungi verifikasi server terenkripsi.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Masukkan Password / Kunci Admin
              </label>
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  required
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setAuthError(null);
                  }}
                  placeholder="Ketik password admin..."
                  className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold tracking-wider focus:outline-hidden focus:border-blue-950 focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi Akses...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Buka Dashboard Admin</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Verifikasi Server Aman</span>
            </span>
            <Link href="/" className="hover:text-blue-900 font-medium transition-colors">
              Kembali ke Web Publik
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      name: "Dashboard Utama",
      href: "/admin",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "Dify AI Studio & Drafts",
      href: "/admin/dify-ai",
      icon: Sparkles,
      badge: "AI Active",
    },
    {
      name: "Kelola Kategori Dinamis",
      href: "/admin/kategori",
      icon: Tag,
      badge: null,
    },
    {
      name: "Panduan Belanja & Produk",
      href: "/admin/panduan",
      icon: ShoppingBag,
      badge: null,
    },
    {
      name: "Kabar & Fakta vs Mitos",
      href: "/admin/berita",
      icon: Newspaper,
      badge: "✍️ Tulis Berita",
    },
    {
      name: "SEO & Google Verification",
      href: "/admin/seo",
      icon: Search,
      badge: "Google Ready",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Direct Meta Tag Hoisting in React 19 */}
      <meta name="robots" content="noindex, nofollow, noarchive" />

      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3.5 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Logo size="sm" />
          <span className="text-[10px] font-black uppercase tracking-wider bg-blue-950 text-white px-2 py-0.5 rounded">
            ADMIN
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100"
            title="Kunci Dashboard"
          >
            <Lock className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } lg:block w-full lg:w-72 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col justify-between p-5 lg:h-screen lg:sticky lg:top-0 z-40`}
      >
        <div className="space-y-6">
          {/* Logo & Security Lock */}
          <div className="hidden lg:flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Logo size="md" />
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-950 text-white px-2 py-0.5 rounded shadow-xs">
                ADMIN
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Kunci / Keluar dari Dashboard Admin"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-2 flex items-center justify-between">
              <span>Menu Manajemen Portal</span>
              <span className="text-emerald-700 font-bold text-[9px] bg-emerald-50 px-1 rounded border border-emerald-200">
                LOCKED SECURE
              </span>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-950 text-white shadow-xs font-bold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-blue-950"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wide ${
                        isActive
                          ? "bg-blue-800 text-blue-100"
                          : "bg-blue-50 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Coolify & Live Portal Links */}
        <div className="pt-6 border-t border-slate-100 space-y-3 mt-6 lg:mt-0">
          {/* Live Link */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 hover:text-blue-950 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
              <span>Buka Web Live Portal</span>
            </span>
            <span className="text-[10px] text-slate-400">daereview.daeroom.my.id</span>
          </Link>

          {/* Coolify & Security Status */}
          <div className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                <Server className="w-3 h-3 text-blue-700" />
                <span>Coolify Server</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Aktif
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-600" />
                <span>Anti-Scrape / NoIndex:</span>
              </span>
              <span className="text-emerald-700 font-semibold font-mono">Protected</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 bg-slate-50/70 min-h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
