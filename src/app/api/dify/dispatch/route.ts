import { NextResponse } from "next/server";
import { savePendingDispatch } from "@/lib/dispatchStore";

const DIFY_SECRET = process.env.DIFY_WEBHOOK_SECRET || "dae_dify_autonomous_webhook_secret_key";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8810761979:AAFTbAVxgfarUaqN7JBPmVc9liWFKjPMR4o";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "7045828398";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://daereview.daeroom.my.id";

function cleanTgText(text: string): string {
  if (!text) return "";
  return text.replace(/\[/g, "(").replace(/\]/g, ")");
}

export async function POST(request: Request) {
  try {
    // 1. Verifikasi Autentikasi Dify Agent
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Akses ditolak. Header 'Authorization: Bearer <token>' wajib disertakan." },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "").trim();
    if (token !== DIFY_SECRET) {
      return NextResponse.json(
        { error: "Token Dify tidak valid." },
        { status: 403 }
      );
    }

    // 2. Baca Payload Dispatch dari Tim 0 Project Manager
    const body = await request.json();
    const {
      decision = "DISPATCH",
      target_division = "Tim 1: DaeReview Newsroom",
      topic_title = "Usulan Topik Editorial Baru",
      recommended_angle = "Investigasi & Analisis Mendalam",
      telegram_message = "",
      product_link = "",
      raw_input = "",
    } = body;

    const isProductLab =
      target_division.toLowerCase().includes("product") ||
      target_division.toLowerCase().includes("lab") ||
      target_division.toLowerCase().includes("tim 2");

    const effectiveTitle = (topic_title || raw_input || "Usulan Topik Redaksi").trim();
    const effectiveAngle = (recommended_angle || "Sudut pandang independen & berimbang").trim();
    const targetDivisionName = isProductLab ? "Tim 2: DaeReview Product Lab" : "Tim 1: DaeReview Newsroom";

    // 3. Simpan dispatch ID ke memory/store agar aman dari batas 64-byte Telegram callback_data
    const dispatchId = savePendingDispatch({
      topic: effectiveTitle,
      angle: effectiveAngle,
      targetDivision: targetDivisionName,
      productLink: product_link || undefined,
    });

    // 4. Susun Pesan Telegram Markdown yang Aman (tanpa reserved unescaped brackets)
    const lines = [
      `👑 *(PENUGASAN REDAKSI - TIM 0 PROJECT MANAGER)*`,
      ``,
      `🏢 *Rekomendasi Divisi:* ${isProductLab ? "🔬 Tim 2: Product Lab" : "📰 Tim 1: Newsroom"}`,
      `📌 *Topik Usulan:*`,
      `${cleanTgText(effectiveTitle)}`,
      ``,
      `🎯 *Sudut Pandang (Angle):*`,
      `${cleanTgText(effectiveAngle)}`,
      product_link ? `🔗 *Sumber / Link:* ${product_link}` : "",
      telegram_message ? `\n💡 *Analisis & Briefing Desk:*\n${cleanTgText(telegram_message)}` : "",
      ``,
      `Silakan konfirmasi tombol di bawah untuk mengeksekusi penugasan:`,
    ].filter(Boolean);

    const message = lines.join("\n");

    const replyMarkup = {
      inline_keyboard: [
        [
          {
            text: isProductLab ? "🔬 [REKOMENDASI] Gas Tim 2 (Product Lab)" : "📰 [REKOMENDASI] Gas Tim 1 (Newsroom)",
            callback_data: isProductLab ? `disp_lab:${dispatchId}` : `disp_news:${dispatchId}`,
          },
        ],
        [
          {
            text: isProductLab ? "📰 Alihkan ke Tim 1 (Newsroom)" : "🔬 Alihkan ke Tim 2 (Product Lab)",
            callback_data: isProductLab ? `disp_news:${dispatchId}` : `disp_lab:${dispatchId}`,
          },
        ],
        [
          {
            text: "✏️ Buka Dashboard Admin",
            url: `${SITE_URL}/admin/berita`,
          },
        ],
      ],
    };

    // 5. Kirim Notifikasi Interaktif ke Telegram CEO
    try {
      const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
          reply_markup: replyMarkup,
        }),
      });

      if (!res.ok) {
        console.warn("Telegram dispatch sendMessage with markdown failed, retrying plain text...", await res.text());
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            reply_markup: replyMarkup,
          }),
        });
      }
    } catch (tgErr) {
      console.error("Gagal kirim notifikasi Telegram dispatch:", tgErr);
    }

    return NextResponse.json({
      success: true,
      message: "Instruksi penugasan Tim 0 berhasil diproses dan dikirim ke Telegram CEO!",
      dispatch_id: dispatchId,
      decision,
      target_division: targetDivisionName,
      topic_title: effectiveTitle,
      recommended_angle: effectiveAngle,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal memproses dispatch dari Tim 0.", details: error.message },
      { status: 500 }
    );
  }
}
