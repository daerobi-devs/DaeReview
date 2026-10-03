-- ==============================================================================
-- DAEREVIEW SUPABASE PRODUCTION DATABASE SCHEMA
-- Arsitektur: PostgreSQL dengan Row-Level Security (RLS) & Indexing Performa Tinggi
-- Target: Tahan lonjakan ribuan user, fast query <5ms, terproteksi dari injeksi
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABEL: CATEGORIES (Kategori Dinamis Portal)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    icon VARCHAR(64) NOT NULL DEFAULT 'Grid',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing Categories
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories (display_order ASC);

-- ==============================================================================
-- 3. TABEL: ARTICLES (Berita, Tren, Debunking Fakta vs Mitos & AI)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(300) NOT NULL,
    category VARCHAR(80) NOT NULL,
    summary TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array paragraf teks
    image TEXT NOT NULL,
    author VARCHAR(120) NOT NULL DEFAULT 'Tim Riset DaeReview',
    read_time VARCHAR(50) DEFAULT '4 menit',
    is_trending BOOLEAN DEFAULT FALSE,
    is_fact_check BOOLEAN DEFAULT FALSE,
    verdict_fact_check VARCHAR(40) CHECK (verdict_fact_check IN ('FAKTA', 'MITOS', 'SEBAGIAN BENAR') OR verdict_fact_check IS NULL),
    quick_takeaway TEXT,
    related_product_id VARCHAR(100),
    tiktok_url TEXT,
    view_count INT DEFAULT 0,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing Kinerja Tinggi untuk Ribuan Kunjungan (B-Tree Indexes)
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles (category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_is_trending ON public.articles (is_trending) WHERE is_trending = TRUE;
CREATE INDEX IF NOT EXISTS idx_articles_is_fact_check ON public.articles (is_fact_check) WHERE is_fact_check = TRUE;

-- ==============================================================================
-- 4. TABEL: PRODUCTS (Katalog Panduan Belanja & Link Afiliasi)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(100) PRIMARY KEY,
    rank INT NOT NULL DEFAULT 1,
    badge VARCHAR(50) NOT NULL CHECK (badge IN ('PILIHAN UTAMA', 'HARGA TERBAIK', 'KUALITAS PREMIUM', 'POPULER')),
    name VARCHAR(255) NOT NULL,
    tagline TEXT NOT NULL,
    category VARCHAR(80) NOT NULL,
    rating NUMERIC(3, 1) NOT NULL DEFAULT 4.8,
    review_count INT NOT NULL DEFAULT 0,
    price VARCHAR(60) NOT NULL,
    original_price VARCHAR(60),
    discount VARCHAR(30),
    image TEXT NOT NULL,
    pros JSONB DEFAULT '[]'::jsonb,
    cons JSONB DEFAULT '[]'::jsonb,
    specs JSONB DEFAULT '{}'::jsonb,
    shopee_url TEXT NOT NULL,
    tokopedia_url TEXT NOT NULL,
    tiktok_url TEXT,
    verified_official BOOLEAN DEFAULT TRUE,
    verdict TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing Products
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
CREATE INDEX IF NOT EXISTS idx_products_rank ON public.products (rank ASC);

-- ==============================================================================
-- 5. TABEL: DIFY_DRAFTS (Kotak Masuk Draf Konten Otomatis Dify AI)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.dify_drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(300) NOT NULL,
    category VARCHAR(80) NOT NULL,
    summary TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '[]'::jsonb,
    image TEXT,
    suggested_products JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(30) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'rejected')),
    generated_by VARCHAR(120) DEFAULT 'Dify Autonomous Agent',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dify_drafts_status ON public.dify_drafts (status);

-- ==============================================================================
-- 6. SECURITY: ROW LEVEL SECURITY (RLS) POLICIES
-- Mencegah injeksi iklan liar atau manipulasi data dari user publik
-- ==============================================================================

-- Aktifkan RLS di semua tabel
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dify_drafts ENABLE ROW LEVEL SECURITY;

-- Policy Categories: Publik hanya boleh BACA (SELECT), hanya authenticated/service role yang boleh ubah
CREATE POLICY "Public read categories" 
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Admin write categories" 
ON public.categories FOR ALL 
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Policy Articles: Publik hanya boleh BACA (SELECT)
CREATE POLICY "Public read articles" 
ON public.articles FOR SELECT USING (true);

CREATE POLICY "Admin write articles" 
ON public.articles FOR ALL 
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Policy Products: Publik hanya boleh BACA (SELECT)
CREATE POLICY "Public read products" 
ON public.products FOR SELECT USING (true);

CREATE POLICY "Admin write products" 
ON public.products FOR ALL 
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Policy Dify Drafts: Hanya admin & backend service yang boleh akses
CREATE POLICY "Admin access dify drafts" 
ON public.dify_drafts FOR ALL 
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ==============================================================================
-- 7. SEED DATA AWAL (KATEGORI RESMI)
-- ==============================================================================
INSERT INTO public.categories (id, name, icon, display_order)
VALUES 
    ('semua', 'Semua Kategori', 'Grid', 1),
    ('gadget', 'Gadget & Setup', 'Laptop', 2),
    ('audio', 'Audio & TWS', 'Headphones', 3),
    ('smarthome', 'Smart Home', 'Home', 4),
    ('dapur', 'Peralatan Dapur', 'Coffee', 5),
    ('lifestyle', 'Gaya Hidup', 'Watch', 6)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 8. MIGRATION COMMANDS (JIKA SUDAH PERNAH MENJALANKAN SKEMA SEBELUMNYA)
-- ==============================================================================
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS tiktok_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tiktok_url TEXT;

-- Selesai! Skema ini 100% siap di-copy-paste ke SQL Editor Supabase.
