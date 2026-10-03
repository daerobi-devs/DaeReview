"use client";

import React from "react";
import { Product } from "@/data/mockData";
import { ArrowRight, ExternalLink, SlidersHorizontal } from "lucide-react";
import AffiliateButton from "@/components/AffiliateButton";

interface ComparisonTableProps {
  products: Product[];
}

export default function ComparisonTable({ products }: ComparisonTableProps) {
  return (
    <section id="perbandingan" className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 tracking-wider uppercase mb-1">
            <SlidersHorizontal className="w-4 h-4 text-slate-800" /> BANDINGKAN SPESIFIKASI
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tabel Perbandingan Produk Terbaik
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Lihat perbedaan fitur, harga terkini, dan skor pengujian untuk mempermudah keputusan belanjamu.
          </p>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                <th className="py-4 px-6 font-bold">Peringkat & Produk</th>
                <th className="py-4 px-6 font-bold">Kategori</th>
                <th className="py-4 px-6 font-bold">Rating Pengguna</th>
                <th className="py-4 px-6 font-bold">Kisaran Harga</th>
                <th className="py-4 px-6 font-bold">Keunggulan Utama</th>
                <th className="py-4 px-6 font-bold text-center">Tautan Toko</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {products.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Name & Thumb */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-900 text-xs font-bold flex items-center justify-center shrink-0">
                        #{item.rank}
                      </span>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-1">{item.name}</div>
                        <span className="text-[11px] text-orange-600 font-semibold">{item.badge}</span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-6 text-slate-600 capitalize text-xs font-medium">
                    {item.category}
                  </td>

                  {/* Rating: Clean Numeric */}
                  <td className="py-4 px-6">
                    <div className="inline-block bg-slate-100 text-slate-900 font-bold text-xs px-2 py-1 rounded">
                      {item.rating} / 5
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-6 font-black text-slate-900">
                    <div>{item.price}</div>
                    {item.discount && (
                      <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                        -{item.discount}
                      </span>
                    )}
                  </td>

                  {/* Key Feature */}
                  <td className="py-4 px-6 text-slate-600 text-xs max-w-xs">
                    <span className="line-clamp-2">{item.pros[0]}</span>
                  </td>

                  {/* CTA — Dynamically adapts to available store URLs */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      {item.shopeeUrl?.trim() && (
                        <AffiliateButton
                          store="shopee"
                          href={item.shopeeUrl}
                          productName={item.name}
                          productId={item.id}
                          sourcePage="/#perbandingan"
                          className="inline-flex items-center gap-1 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-2xs transition-all whitespace-nowrap cursor-pointer"
                        >
                          <span>Shopee</span>
                          <ExternalLink className="w-3 h-3" />
                        </AffiliateButton>
                      )}
                      {item.tokopediaUrl?.trim() && (
                        <AffiliateButton
                          store="tokopedia"
                          href={item.tokopediaUrl}
                          productName={item.name}
                          productId={item.id}
                          sourcePage="/#perbandingan"
                          className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold py-1.5 px-3 rounded-lg transition-all whitespace-nowrap cursor-pointer"
                        >
                          <span>Tokopedia</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </AffiliateButton>
                      )}
                      {item.tiktokUrl?.trim() && (
                        <AffiliateButton
                          store="tiktok"
                          href={item.tiktokUrl}
                          productName={item.name}
                          productId={item.id}
                          sourcePage="/#perbandingan"
                          className="inline-flex items-center gap-1 bg-slate-900 hover:bg-black text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-all whitespace-nowrap cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          <span>TikTok</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </AffiliateButton>
                      )}
                      {!item.shopeeUrl?.trim() && !item.tokopediaUrl?.trim() && !item.tiktokUrl?.trim() && (
                        <AffiliateButton
                          store="shopee"
                          productName={item.name}
                          productId={item.id}
                          sourcePage="/#perbandingan"
                          className="inline-flex items-center gap-1 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-2xs transition-all whitespace-nowrap cursor-pointer"
                        >
                          <span>Cek Toko</span>
                          <ExternalLink className="w-3 h-3" />
                        </AffiliateButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
