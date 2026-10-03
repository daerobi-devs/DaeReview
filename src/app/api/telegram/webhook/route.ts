import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { NewsArticle } from "@/data/mockData";
import { supabaseAdmin } from "@/lib/supabase";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8810761979:AAFTbAVxgfarUaqN7JBPmVc9liWFKjPMR4o";
const AUTHORIZED_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "7045828398";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://daereview.daeroom.my.id";
const DIFY_SERVER_URL = process.env.DIFY_SERVER_URL || "https://dify.daeroom.my.id";
const DATA_FILE = path.join(process.cwd(), "src", "data", "custom_news.json");

function readCustomNews(): NewsArticle[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeCustomNews(data: NewsArticle[]): boolean {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}

async function sendTelegramMessage(chatId: string | number, text: string, replyMarkup?: any) {
  try {
    const payload: any = {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
    };
    if (replyMarkup) payload.reply_markup = replyMarkup;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Gagal kirim pesan Telegram:", err);
  }
}

async function editTelegramMessage(chatId: string | number, messageId: number, text: string, replyMarkup?: any) {
  try {
    const payload: any = {
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: "Markdown",
    };
    if (replyMarkup) payload.reply_markup = replyMarkup;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Gagal edit pesan Telegram:", err);
  }
}

async function answerCallbackQuery(callbackQueryId: string, text: string, showAlert = false) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text,
        show_alert: showAlert,
      }),
    });
  } catch (err) {
    console.error("Gagal answerCallbackQuery:", err);
  }
}

// 5 Topik Brainstorming Kurasi
const TRENDING_TOPICS = [
  {
    id: "1",
    type: "news",
    title: "Kebijakan Sertifikasi AI & Watermark Kominfo untuk Pemilu & Konten Digital",
    summary: "Aturan baru pelabelan konten AI di Indonesia serta sanksi bagi penyebar misinformasi.",
  },
  {
    id: "2",
    type: "product",
    title: "Infinix Note 50 Pro vs Redmi Note 14 5G di Kelas 2 Jutaan",
    summary: "Uji jeroan chipset, stabilitas kamera 108MP, dan kompromi suhu saat gaming harian.",
  },
  {
    id: "3",
    type: "news",
    title: "Gelombang PHK dan Pivot Startup AI Global ke Model Edge Computing Lokal",
    summary: "Pergeseran infrastruktur cloud AI ke komputasi on-device di smartphone dan laptop 2026.",
  },
  {
    id: "4",
    type: "product",
    title: "TWS ANC Murah di Bawah Rp 250 Ribu: Realita Desibel vs Klaim Brosur",
    summary: "Audit 3 TWS terlaris di Shopee/Tokopedia: apakah benar mampu meredam bising kendaraan?",
  },
  {
    id: "5",
    type: "news",
    title: "Perang Chipset 3nm: Apple M4, Snapdragon X Elite, dan Intel Lunar Lake di Indonesia",
    summary: "Analisis performa baterai 20 jam dan efisiensi kerja nyata programmer & kreator lokal.",
  },
];

export async function GET() {
  return NextResponse.json({
    status: "ok",
    bot: "@daereview_editorial_bot",
    service: "DaeReview Assignment Desk (Tim 0: Project Manager)",
    authorizedChatId: AUTHORIZED_CHAT_ID ? `${AUTHORIZED_CHAT_ID.slice(0, 3)}***` : "unset",
  });
}

export async function POST(request: Request) {
  try {
    const update = await request.json();

    // 1. Tangani Callback Query (Tombol Ditekan)
    if (update.callback_query) {
      const cq = update.callback_query;
      const cqId = cq.id;
      const data = cq.data || "";
      const chatId = cq.message?.chat?.id;
      const messageId = cq.message?.message_id;

      // Verifikasi hak akses CEO
      if (String(chatId) !== String(AUTHORIZED_CHAT_ID)) {
        await answerCallbackQuery(cqId, "Akses ditolak. Khusus pimpinan redaksi.", true);
        return NextResponse.json({ ok: true });
      }

      // Action: Approve News Article
      if (data.startsWith("approve_news:")) {
        const slug = data.replace("approve_news:", "").trim();
        const current = readCustomNews();
        const index = current.findIndex((a) => a.slug === slug);

        if (index >= 0) {
          current[index].status = "published";
          writeCustomNews(current);
        }

        // Update di Supabase
        try {
          await supabaseAdmin
            .from("articles")
            .update({ status: "published", updated_at: new Date().toISOString() })
            .eq("slug", slug);
        } catch (dbErr) {
          console.warn("Update Supabase status:", dbErr);
        }

        await answerCallbackQuery(cqId, "✅ Artikel Resmi Disetujui & Diterbitkan!", true);

        const articleTitle = current[index]?.title || slug;
        const editedText = [
          `🟢 *[ARTIKEL RESMI TELAH DITERBITKAN OLEH CEO]*`,
          ``,
          `📌 *Judul:* ${articleTitle}`,
          `📊 *Status:* DITERBITKAN (LIVE DI PORTAL)`,
          ``,
          `🌐 *Tautan Portal Publik:*`,
          `${SITE_URL}/berita/${slug}`,
        ].join("\n");

        await editTelegramMessage(chatId, messageId, editedText, {
          inline_keyboard: [
            [
              { text: "🌐 Buka di Portal", url: `${SITE_URL}/berita/${slug}` },
              { text: "✏️ Kelola di Admin", url: `${SITE_URL}/admin/berita` },
            ],
          ],
        });

        return NextResponse.json({ ok: true });
      }

      // Action: Reject News Article
      if (data.startsWith("reject_news:")) {
        const slug = data.replace("reject_news:", "").trim();
        const current = readCustomNews();
        const updated = current.filter((a) => a.slug !== slug);
        writeCustomNews(updated);

        try {
          await supabaseAdmin.from("articles").delete().eq("slug", slug);
        } catch (dbErr) {
          console.warn("Delete Supabase article:", dbErr);
        }

        await answerCallbackQuery(cqId, "❌ Draf Berhasil Ditolak & Dihapus.", true);

        await editTelegramMessage(
          chatId,
          messageId,
          `❌ *[DRAF DITOLAK & DIHAPUS OLEH CEO]*\n\nArtikel dengan slug \`${slug}\` telah dihapus dari antrean draf dan tidak akan diterbitkan.`,
          {
            inline_keyboard: [
              [{ text: "✏️ Cek Draf Lain di Admin", url: `${SITE_URL}/admin/berita` }],
            ],
          }
        );

        return NextResponse.json({ ok: true });
      }

      // Action: Dispatch Topic to Tim 1 (Newsroom)
      if (data.startsWith("dispatch_news:")) {
        const topicRaw = data.replace("dispatch_news:", "").trim();
        const topic = decodeURIComponent(topicRaw);

        await answerCallbackQuery(cqId, "🚀 Menugaskan Tim 1: Newsroom...");

        await sendTelegramMessage(
          chatId,
          [
            `🚀 *[TIM 1: DAEREVIEW NEWSROOM DITUGASKAN]*`,
            ``,
            `📌 *Topik Berita:*`,
            `_${topic}_`,
            ``,
            `🤖 *Tahapan Redaksi Otomatis Sedang Berjalan:*`,
            `1️⃣ *Trend & Fact Scout:* Riset DuckDuckGo fakta terkini`,
            `2️⃣ *Investigative Reporter:* Menulis narasi tajam & mengalir`,
            `3️⃣ *Managing Editor:* Uji format Swiss, no-cliché & sanitasi`,
            `4️⃣ *Status:* Akan dikirim ke sini sebagai *DRAFT* untuk persetujuan Anda!`,
            ``,
            `💡 *Info:* Buka Dify di ${DIFY_SERVER_URL} untuk memonitor jalannya agen.`,
          ].join("\n")
        );

        return NextResponse.json({ ok: true });
      }

      // Action: Dispatch Topic to Tim 2 (Product Lab)
      if (data.startsWith("dispatch_product:")) {
        const topicRaw = data.replace("dispatch_product:", "").trim();
        const topic = decodeURIComponent(topicRaw);

        await answerCallbackQuery(cqId, "🔬 Menugaskan Tim 2: Product Lab...");

        await sendTelegramMessage(
          chatId,
          [
            `🔬 *[TIM 2: DAEREVIEW PRODUCT LAB DITUGASKAN]*`,
            ``,
            `📦 *Target Gadget / Produk:*`,
            `_${topic}_`,
            ``,
            `⚙️ *Tahapan Pengujian Lab Sedang Berjalan:*`,
            `1️⃣ *Hardware Auditor:* Uji klaim brosur vs realita benchmark`,
            `2️⃣ *The Catch Finder:* Membongkar kelemahan tersembunyi & kompromi`,
            `3️⃣ *Lead Reviewer:* Tabel komparasi, Siapa yang Beli vs Skip`,
            `4️⃣ *Status:* Akan dikirim ke sini sebagai *DRAFT* untuk persetujuan Anda!`,
            ``,
            `💡 *Info:* Buka Dify di ${DIFY_SERVER_URL} untuk memonitor jalannya agen.`,
          ].join("\n")
        );

        return NextResponse.json({ ok: true });
      }

      // Action: Brainstorm Topic Pick
      if (data.startsWith("pick_trend:")) {
        const idx = parseInt(data.replace("pick_trend:", ""), 10);
        const item = TRENDING_TOPICS[idx] || TRENDING_TOPICS[0];

        await answerCallbackQuery(cqId, `Memilih: ${item.title.slice(0, 30)}...`);

        const isNews = item.type === "news";
        const replyText = [
          `💡 *Topik Terpilih:*`,
          `*${item.title}*`,
          ``,
          `📝 *Konteks:* ${item.summary}`,
          ``,
          `Saran Assignment Desk: Ditugaskan ke *${isNews ? "Tim 1 (Newsroom)" : "Tim 2 (Product Lab)"}*.`,
          `Silakan konfirmasi tombol di bawah untuk mengeksekusi:`,
        ].join("\n");

        await sendTelegramMessage(chatId, replyText, {
          inline_keyboard: [
            [
              {
                text: isNews ? "📰 Gas Tim 1 (Newsroom)" : "🔬 Gas Tim 2 (Product Lab)",
                callback_data: isNews
                  ? `dispatch_news:${encodeURIComponent(item.title)}`
                  : `dispatch_product:${encodeURIComponent(item.title)}`,
              },
            ],
            [
              {
                text: isNews ? "🔬 Alihkan ke Tim 2 (Lab)" : "📰 Alihkan ke Tim 1 (Berita)",
                callback_data: isNews
                  ? `dispatch_product:${encodeURIComponent(item.title)}`
                  : `dispatch_news:${encodeURIComponent(item.title)}`,
              },
            ],
          ],
        });

        return NextResponse.json({ ok: true });
      }
    }

    // 2. Tangani Pesan Teks Masuk dari CEO
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat?.id;
      const text = (msg.text || "").trim();

      // Guard: Hanya pemilik yang diizinkan berinteraksi
      if (String(chatId) !== String(AUTHORIZED_CHAT_ID)) {
        await sendTelegramMessage(
          chatId,
          "🔒 *Pusat Komando Redaksi Tertutup.*\nBot ini adalah asisten internal pimpinan redaksi DaeReview."
        );
        return NextResponse.json({ ok: true });
      }

      // Command /start atau /help
      if (text === "/start" || text === "/help" || text.toLowerCase() === "menu") {
        const welcomeText = [
          `👑 *Selamat Datang di DaeReview Assignment Desk!*`,
          ``,
          `Halo Pak CEO, saya *Project Manager (Tim 0)* ruang redaksi AI DaeReview. Saya siap membantu mengarahkan dan mengeksekusi liputan melalui 2 divisi independen:`,
          ``,
          `📰 *Tim 1: DaeReview Newsroom*`,
          `Fokus: Berita teknologi cepat, isu viral, regulasi, dan investigasi mendalam. Mengalir bebas tanpa embel-embel review belanja atau tabel spek.`,
          ``,
          `🔬 *Tim 2: DaeReview Product Lab*`,
          `Fokus: Ulasan gadget mendalam, uji klaim vs realita hardware, *The Catch* (kelemahan fatal), siapa yang wajib beli vs siapa yang skip, untuk tab \`/panduan\` dan \`/produk\`.`,
          ``,
          `🛠️ *Perintah & Cara Kerja Cepat:*`,
          `• 💡 Kirim */trend* atau ketik *"ide topik"*: Saya akan berikan 5 tren terhangat hari ini.`,
          `• 🔗 *Kirim Tautan / Link:* Kirim link berita atau link marketplace (Shopee/Tokopedia), saya otomatis menganalisis dan memberi rekomendasi tim penggarap.`,
          `• ✍️ *Ketik Ide Mentah:* Ketik topik bebas (misal: _"Review Keyboard Aula F75"_, _"ChatGPT rilis fitur baru"_).`,
          `• 🛡️ *Draft-First Guard:* Semua hasil tulisan agen disimpan sebagai *DRAFT* terlebih dahulu. Anda yang memegang kendali final untuk menerbitkan lewat tombol Telegram!`,
        ].join("\n");

        await sendTelegramMessage(chatId, welcomeText, {
          inline_keyboard: [
            [{ text: "💡 Brainstorm 5 Ide Tren Hari Ini", callback_data: "pick_trend:0" }],
            [
              { text: "✏️ Kelola Draf di Admin", url: `${SITE_URL}/admin/berita` },
              { text: "🌐 Buka Portal DaeReview", url: SITE_URL },
            ],
          ],
        });
        return NextResponse.json({ ok: true });
      }

      // Command /trend atau Brainstorming
      if (
        text === "/trend" ||
        text.toLowerCase().includes("trend") ||
        text.toLowerCase().includes("ide") ||
        text.toLowerCase().includes("topik") ||
        text.toLowerCase().includes("brainstorm")
      ) {
        const trendList = TRENDING_TOPICS.map(
          (t, i) =>
            `*${i + 1}. [${t.type === "news" ? "BERITA" : "PRODUK"}] ${t.title}*\n_${t.summary}_\n`
        ).join("\n");

        const trendText = [
          `💡 *[RADAR TREN TEKNOLOGI & GADGET HARI INI]*`,
          ``,
          trendList,
          `Pilih topik yang ingin dieksekusi oleh Tim Redaksi:`,
        ].join("\n");

        await sendTelegramMessage(chatId, trendText, {
          inline_keyboard: [
            [
              { text: "📰 Eksekusi No. 1 (Berita)", callback_data: "pick_trend:0" },
              { text: "🔬 Eksekusi No. 2 (Produk)", callback_data: "pick_trend:1" },
            ],
            [
              { text: "📰 Eksekusi No. 3 (Berita)", callback_data: "pick_trend:2" },
              { text: "🔬 Eksekusi No. 4 (Produk)", callback_data: "pick_trend:3" },
            ],
            [{ text: "📰 Eksekusi No. 5 (Berita)", callback_data: "pick_trend:4" }],
          ],
        });
        return NextResponse.json({ ok: true });
      }

      // Smart Triage / Routing Link atau Topik Mentah
      const isProductLink =
        text.includes("shopee.co.id") ||
        text.includes("tokopedia.com") ||
        text.includes("blibli.com") ||
        text.includes("lazada.co.id") ||
        text.toLowerCase().startsWith("review ") ||
        text.toLowerCase().includes("spek ") ||
        text.toLowerCase().includes("tws") ||
        text.toLowerCase().includes("keyboard");

      if (isProductLink) {
        const productTriageText = [
          `📦 *[ANALISIS ASSIGNMENT DESK - TIM 0]*`,
          ``,
          `Input Anda:`,
          `_"${text}"_`,
          ``,
          `Terdeteksi sebagai: 🔬 *Review Produk / Panduan Belanja*`,
          ``,
          `💡 *Rekomendasi:* Masuk ke *Tim 2 (DaeReview Product Lab)* untuk menguji klaim spek hardware, The Catch, rasio nilai-ke-harga, dan rekomendasi beli/skip.`,
          ``,
          `Silakan tentukan divisi yang ditugaskan:`,
        ].join("\n");

        await sendTelegramMessage(chatId, productTriageText, {
          inline_keyboard: [
            [
              {
                text: "🔬 Tugaskan Tim 2: Product Lab (Rekomendasi)",
                callback_data: `dispatch_product:${encodeURIComponent(text.slice(0, 100))}`,
              },
            ],
            [
              {
                text: "📰 Tetap Jadikan Berita (Tim 1: Newsroom)",
                callback_data: `dispatch_news:${encodeURIComponent(text.slice(0, 100))}`,
              },
            ],
          ],
        });
      } else {
        const newsTriageText = [
          `📰 *[ANALISIS ASSIGNMENT DESK - TIM 0]*`,
          ``,
          `Input Anda:`,
          `_"${text}"_`,
          ``,
          `Terdeteksi sebagai: 📰 *Isu Berita / Tren Teknologi*`,
          ``,
          `💡 *Rekomendasi:* Masuk ke *Tim 1 (DaeReview Newsroom)* untuk ditulis sebagai artikel jurnalisme tajam, padat, dan mengalir *tanpa* format belanja.`,
          ``,
          `Silakan tentukan divisi yang ditugaskan:`,
        ].join("\n");

        await sendTelegramMessage(chatId, newsTriageText, {
          inline_keyboard: [
            [
              {
                text: "📰 Tugaskan Tim 1: Newsroom (Rekomendasi)",
                callback_data: `dispatch_news:${encodeURIComponent(text.slice(0, 100))}`,
              },
            ],
            [
              {
                text: "🔬 Jadikan Ulasan Produk (Tim 2: Product Lab)",
                callback_data: `dispatch_product:${encodeURIComponent(text.slice(0, 100))}`,
              },
            ],
          ],
        });
      }

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true, status: "ignored" });
  } catch (error: any) {
    console.error("Kesalahan Telegram Webhook:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
