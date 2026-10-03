import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronRight, FileCheck, AlertTriangle, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan — DaeReview",
  description:
    "Syarat dan ketentuan resmi penggunaan portal panduan belanja dan ulasan independen DaeReview.",
};

export default function SyaratKetentuanPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-orange-100 selection:text-orange-900">
      <Header />

      <main className="flex-1 pb-20">
        {/* Breadcrumb Navigation */}
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5">
            <nav className="flex items-center space-x-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-slate-900 transition-colors">
                Beranda
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-bold">Syarat & Ketentuan</span>
            </nav>
          </div>
        </div>

        {/* Content Header */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-6 border-b border-slate-100">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <FileCheck className="w-4 h-4 text-slate-900" />
            <span>KETENTUAN PENGGUNAAN LAYANAN</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Syarat & Ketentuan (Terms of Service)
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            Terakhir diperbarui: 3 Oktober 2026. Mengatur penggunaan layanan dan konten ulasan di{" "}
            <strong className="text-slate-900">daereview.daeroom.my.id</strong>.
          </p>
        </header>

        {/* Legal Body Text */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 prose prose-slate max-w-none text-slate-700 space-y-8 text-sm sm:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs flex items-center justify-center font-bold">1</span>
              Penerimaan Ketentuan
            </h2>
            <p>
              Dengan mengakses, menelusuri, atau menggunakan portal ulasan <strong>DaeReview</strong>, Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat secara hukum pada Syarat dan Ketentuan ini. Jika Anda tidak menyetujui salah satu bagian ketentuan, Anda dipersilakan untuk tidak melanjutkan penggunaan situs kami.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs flex items-center justify-center font-bold">2</span>
              Sifat Layanan & Peran DaeReview
            </h2>
            <p>
              DaeReview beroperasi sebagai <strong>portal kurasi ulasan, perbandingan teknis, dan media informasi belanja independen</strong>. DaeReview <strong>BUKAN</strong> merupakan pedagang langsung, penjual, pabrikan, pengimpor, ataupun penyedia jasa pengiriman atas produk apa pun yang ditampilkan di situs ini.
            </p>
            <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-amber-900 text-sm space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Penting Mengenai Transaksi Belanja:
              </div>
              <p className="text-amber-800 leading-relaxed text-xs sm:text-sm">
                Segala transaksi pembayaran, proses packing, pengiriman barang, garansi resmi distributor, faktur pajak, dan klaim retur barang yang cacat fisik dilakukan sepenuhnya antara <strong>Anda (pembeli)</strong> dan <strong>merchant/toko resmi di platform marketplace (seperti Shopee atau Tokopedia)</strong>. DaeReview tidak bertanggung jawab atas sengketa yang timbul antara pembeli dan pihak penjual di marketplace.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs flex items-center justify-center font-bold">3</span>
              Disclaimer Akurasi Harga & Ketersediaan Stok
            </h2>
            <p>
              Tim riset kami senantiasa berupaya menyajikan kisaran harga dan ketersediaan barang secara akurat pada saat artikel ulasan dipublikasikan. Namun demikian:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
              <li>Harga barang di marketplace dapat berfluktuasi secara dinamis tanpa pemberitahuan sebelumnya tergantung kebijakan diskon masing-masing toko resmi.</li>
              <li>Kupon promo, gratis ongkir, dan voucher toko terikat pada syarat & ketentuan marketplace bersangkutan.</li>
              <li>Harga final yang mengikat adalah harga yang tercantum pada halaman checkout resmi di aplikasi Shopee atau Tokopedia saat Anda menyelesaikan pembayaran.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs flex items-center justify-center font-bold">4</span>
              Hak Kekayaan Intelektual
            </h2>
            <p>
              Seluruh teks artikel kurasi editorial, susunan komparasi spesifikasi, kode sumber antarmuka, dan logo grafis DaeReview adalah hak milik intelektual yang dilindungi undang-undang hak cipta Republik Indonesia. Dilarang keras melakukan <em>scraping</em> massal otomatis atau menerbitkan ulang tulisan ulasan kami tanpa izin tertulis dari pihak redaksi.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs flex items-center justify-center font-bold">5</span>
              Hukum yang Berlaku
            </h2>
            <p>
              Syarat dan Ketentuan ini diatur dan ditafsirkan semata-mata berdasarkan hukum yang berlaku di <strong>Negara Kesatuan Republik Indonesia</strong>. Segala perselisihan yang timbul akan diselesaikan secara musyawarah mufakat terlebih dahulu.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
