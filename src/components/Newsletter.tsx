"use client";

import React, { useState } from "react";
import { Mail, CheckCircle, BellRing } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-orange-400 text-xs font-semibold border border-slate-700">
          <BellRing className="w-3.5 h-3.5" />
          <span>ALERT DISKON & TREN TERBARU</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Jangan Lewatkan Flash Sale & Ulasan Produk Terkini
        </h2>

        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Dapatkan rangkuman ulasan barang terbaik, bocoran penurunan harga, dan tren gadget terpanas setiap minggu langsung di emailmu.
        </p>

        {subscribed ? (
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm flex items-center justify-center gap-2 max-w-md mx-auto">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>Terima kasih! Kamu sudah terdaftar dalam radar diskon kami.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <div className="relative w-full">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan alamat email kamu..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors shrink-0 shadow-sm cursor-pointer"
            >
              Langganan Gratis
            </button>
          </form>
        )}

        <div className="text-xs text-slate-500">
          Kami benci spam sama seperti kamu. Berhenti berlangganan kapan saja dalam 1 klik.
        </div>
      </div>
    </section>
  );
}
