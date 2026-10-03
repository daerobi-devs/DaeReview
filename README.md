<p align="center">
  <img src="public/icon.svg" width="80" height="80" alt="DaeReview Logo" />
</p>

<h1 align="center">DaeReview</h1>

<p align="center">
  <strong>Portal Kurasi Panduan Belanja & Cek Fakta Teknologi Independen Indonesia</strong><br />
  Bagian dari ekosistem digital <a href="https://daeroom.my.id" target="_blank"><strong>daeroom.my.id</strong></a>
</p>

<p align="center">
  <a href="https://daereview.daeroom.my.id" target="_blank">
    <img src="https://img.shields.io/badge/Live_Portal-daereview.daeroom.my.id-0f172a?style=for-the-badge&logo=vercel" alt="Live Site" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-16_(Turbopack)-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Database-Supabase_PostgreSQL-3ecf8e?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/AI_Engine-Dify_Agent-indigo?style=for-the-badge&logo=openai" alt="Dify AI" />
</p>

---

## 📖 Tentang DaeReview

**DaeReview** adalah platform editorial panduan belanja dan literasi teknologi modern yang mengusung standar jurnalisme teruji ala *Wirecutter* dan *Consumer Reports*. Kami membantu konsumen cerdas di Indonesia mengambil keputusan pembelian terbaik tanpa terjebak gimik pemasaran, rating bintang palsu, atau klaim sepihak.

### ✨ Prinsip & Filosofi Kami
- **Tanpa Bintang Palsu (Zero Fake Stars)**: Kami menggunakan skor evaluasi riil berbasis angka (skala 1–5 atau 1–10) yang dihitung dari 4 pilar pengujian mendalam.
- **Formula Riset 4 Lapis**: Audit spesifikasi teknis, verifikasi ulasan riil e-commerce (Tokopedia & Shopee), konsensus komunitas ahli, dan rasio *Value-for-Money*.
- **Transparansi Komisi Afiliasi**: Tautan belanja mengarah langsung ke *Official Store* mitra resmi tanpa membebankan biaya tambahan sepeser pun kepada pembaca.

---

## 🚀 Fitur Unggulan

### 1. 🔍 Rubrik Universal "Fakta vs Mitos" (Viral & Anti-Hoaks)
- Mengupas tuntas mitos kelistrikan, baterai gadget, peralatan elektronik, dan tren AI.
- Komponen interaktif **VONIS REDAKSI** (`[VONIS: MITOS]`, `[VONIS: FAKTA]`, `[VONIS: SEBAGIAN BENAR]`) lengkap dengan intisari teknis (*Quick Takeaway*).

### 2. ⚡ Client-Side Smart Image Compressor (~100 KB WebP)
- Pengunggahan foto di dashboard admin secara otomatis dikonversi ke format modern **WebP** dengan target bobot **~100 KB**.
- Menghemat data hingga 96% tanpa mengorbankan ketajaman visual di layar resolusi tinggi, menjaga kecepatan *load* di bawah 50ms bagi ribuan pengunjung bersamaan.

### 3. 🤖 Dify AI Autonomous Agent Webhook (`/api/dify/publish`)
- Endpoint API terproteksi Bearer Token yang memungkinkan AI Agent (seperti Dify Workflow) untuk melakukan kurasi otomatis dan menerbitkan artikel atau panduan belanja langsung secara *real-time*.

### 4. 🛡️ Keamanan Tingkat Enterprise & Admin Gate
- **Server-Side Timing-Safe Auth**: Verifikasi password admin di server dengan SHA-256 HMAC timing-safe comparison dan anti-brute force lock.
- **Anti-Google Scraping & Anti-Indexing**: Halaman `/admin` dilindungi meta `noindex, nofollow` serta `Disallow` penuh pada `robots.txt`.
- **HTTP Security Headers**: Dilengkapi CSP, `X-Frame-Options: DENY` (anti-clickjacking), `X-Content-Type-Options: nosniff`, dan `Strict-Transport-Security`.

### 5. 📈 SEO Google Generasi Baru
- Skema JSON-LD terstruktur (`schema.org/WebSite` + `SearchAction` untuk Google Sitelinks Searchbox).
- Dynamic Sitemap Generator (`/sitemap.xml`) dan OpenGraph / Twitter Cards otomatis untuk setiap artikel.

---

## 🛠️ Tech Stack

| Komponen | Teknologi |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Frontend Library** | React 19 (Server & Client Components) |
| **Bahasa** | TypeScript 5 (Strict Mode) |
| **Styling & UI** | Tailwind CSS v4, Lucide React Icons |
| **Database** | Supabase (PostgreSQL dengan Row-Level Security) |
| **Otomasi AI** | Dify AI Content Studio & REST Webhook |
| **Infrastruktur** | Coolify Home Server & Tailscale / Vercel Edge |

---

## 📁 Struktur Direktori

```text
daereview/
├── public/                     # Asset statis, logo SVG, icon
├── src/
│   ├── app/
│   │   ├── admin/             # Dashboard Admin Suite (Clean White + Deep Navy)
│   │   │   ├── berita/        # Manajemen Berita & Form Input Manual
│   │   │   ├── dify-ai/       # Dify AI Studio & Generator
│   │   │   ├── kategori/      # Pengelola Kategori Dinamis
│   │   │   ├── panduan/       # Katalog Panduan Belanja & Afiliasi
│   │   │   └── seo/           # Google Search Console & SERP Preview
│   │   ├── api/               # Server-side REST Endpoints (Auth, Dify, News, Categories)
│   │   ├── berita/            # Hub Publik Kabar, Tren & Fakta vs Mitos
│   │   ├── panduan/           # Halaman Detail Komparasi Produk
│   │   ├── kebijakan-privasi/ # Kebijakan Privasi (Kepatuhan UU PDP)
│   │   ├── pedoman-editorial/ # Pedoman Independensi Redaksi
│   │   ├── syarat-ketentuan/  # Terms of Service & Disclaimer Afiliasi
│   │   ├── layout.tsx         # Root Layout dengan Font Geist & Google Tags
│   │   ├── page.tsx           # Homepage Portal
│   │   ├── robots.ts          # Generator robots.txt (Disallow /admin/)
│   │   └── sitemap.ts         # Generator dinamis sitemap.xml
│   ├── components/            # Komponen UI Reusable (Header, Footer, Hero, Admin)
│   ├── data/                  # Mock data, tipe produk & artikel
│   └── lib/                   # Utility (Supabase client, Image Compressor, Auth)
├── .env.example               # Template environment variables (Sanitized)
├── supabase_schema.sql        # Skema SQL PostgreSQL siap pakai
└── next.config.ts             # Konfigurasi Next.js & HTTP Security Headers
```

---

## 🚀 Memulai (Local Development)

### 1. Kloning Repositori
```bash
git clone https://github.com/daerobi-devs/DaeReview.git
cd DaeReview
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Variabel Lingkungan
Salin file template `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Sesuaikan konfigurasi kunci Supabase dan Password Admin di dalam `.env.local`.

### 4. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

## 🗄️ Menyiapkan Database Supabase

1. Buat project baru di [Supabase](https://supabase.com).
2. Masuk ke menu **SQL Editor**.
3. Buka file [`supabase_schema.sql`](supabase_schema.sql) dari repositori ini, salin seluruh kodenya, dan jalankan (*Run*) di Supabase SQL Editor.
4. Skema akan secara otomatis membuat tabel `categories`, `articles`, `products`, `dify_drafts` beserta aturan keamanan **Row-Level Security (RLS)** dan indeks pencarian.

---

## 📄 Lisensi & Hak Cipta

Dikelola dan dikembangkan oleh tim redaksi **DaeReview**.  
Hak Cipta © 2026 **DaeReview** — Bagian dari ekosistem digital [daeroom.my.id](https://daeroom.my.id). Seluruh hak cipta dilindungi undang-undang.
